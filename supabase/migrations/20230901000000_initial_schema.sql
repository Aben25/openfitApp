-- Create profiles table with expanded fields for onboarding data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  gender TEXT,
  age INTEGER,
  height FLOAT,
  height_unit TEXT CHECK (height_unit IN ('cm', 'ft')),
  weight FLOAT,
  weight_unit TEXT CHECK (weight_unit IN ('kg', 'lbs')),
  fitness_goals JSONB,  -- Array of selected goals with order
  sport_activity TEXT,  -- Optional specific sport/activity
  coach_notes TEXT,     -- Additional notes for coach
  cardio_level INTEGER CHECK (cardio_level BETWEEN 1 AND 5), -- 1-5 scale
  weightlifting_level INTEGER CHECK (weightlifting_level BETWEEN 1 AND 5), -- 1-5 scale
  fitness_notes TEXT,   -- Additional fitness notes
  avoided_exercises TEXT[],  -- Exercises to avoid
  workout_environments TEXT[], -- Selected workout environments
  workouts_per_week INTEGER,
  workout_duration INTEGER,  -- In minutes
  additional_info TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at timestamp on profiles
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- Create storage bucket for profile images and progress photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', false);

-- Create storage bucket for exercise media
INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-media', 'exercise-media', true);

-- Create exercise library table
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  primary_muscles TEXT[],
  secondary_muscles TEXT[],
  equipment_needed TEXT[],
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_template BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at timestamp on workouts
CREATE TRIGGER workouts_updated_at_trigger
BEFORE UPDATE ON public.workouts
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- Create workout_exercises junction table
CREATE TABLE public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INTEGER,
  reps TEXT,  -- Can be "8-12" or specific number
  rest_seconds INTEGER,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_logs table for tracking completed workouts
CREATE TABLE public.workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create completed_sets table for tracking individual sets
CREATE TABLE public.completed_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_log_id UUID REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  set_number INTEGER,
  reps INTEGER,
  weight FLOAT,
  weight_unit TEXT CHECK (weight_unit IN ('kg', 'lbs')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_photos table
CREATE TABLE public.progress_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo_url TEXT,
  notes TEXT,
  taken_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create body_weight_logs table for tracking weight
CREATE TABLE public.body_weight_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  weight FLOAT,
  weight_unit TEXT CHECK (weight_unit IN ('kg', 'lbs')),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_type TEXT,
  description TEXT,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies --

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Exercises policies (public read for all users)
CREATE POLICY "Exercises are viewable by all users" 
ON public.exercises FOR SELECT 
USING (true);

-- Workouts policies
CREATE POLICY "Users can view own workouts" 
ON public.workouts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" 
ON public.workouts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" 
ON public.workouts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" 
ON public.workouts FOR DELETE 
USING (auth.uid() = user_id);

-- Similar policies for other tables
-- Workout exercises
CREATE POLICY "Users can manage workout exercises for own workouts" 
ON public.workout_exercises 
USING (workout_id IN (SELECT id FROM public.workouts WHERE user_id = auth.uid()));

-- Workout logs
CREATE POLICY "Users can view own workout logs" 
ON public.workout_logs FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workout logs" 
ON public.workout_logs FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Completed sets
CREATE POLICY "Users can manage completed sets for own workout logs" 
ON public.completed_sets 
USING (workout_log_id IN (SELECT id FROM public.workout_logs WHERE user_id = auth.uid()));

-- Progress photos
CREATE POLICY "Users can manage own progress photos" 
ON public.progress_photos 
USING (user_id = auth.uid());

-- Body weight logs
CREATE POLICY "Users can manage own body weight logs" 
ON public.body_weight_logs 
USING (user_id = auth.uid());

-- Achievements
CREATE POLICY "Users can view own achievements" 
ON public.achievements 
USING (user_id = auth.uid());

-- Create function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 