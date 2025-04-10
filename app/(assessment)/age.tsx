import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AssessmentHeader } from '@/components/assessment/AssessmentHeader';
import { AssessmentButton, SkipButton } from '@/components/assessment/AssessmentButton';
import { useAssessment } from '@/context/AssessmentContext';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;

// Generate age range from 16 to 80
const AGES = Array.from({ length: 65 }, (_, i) => i + 16);

export default function AgeScreen() {
  const { data, updateField, nextStep } = useAssessment();
  const [selectedAge, setSelectedAge] = useState<number>(data.age || 18);
  const flatListRef = useRef<FlatList>(null);

  // Scroll to the selected age initially
  useEffect(() => {
    if (flatListRef.current) {
      const index = AGES.findIndex(age => age === selectedAge);
      if (index !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewOffset: (VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT,
          });
        }, 500);
      }
    }
  }, []);

  const handleSelectAge = (age: number) => {
    setSelectedAge(age);
    updateField('age', age);
  };

  const renderAgeItem = ({ item }: { item: number }) => {
    const isSelected = item === selectedAge;
    return (
      <TouchableOpacity
        style={[
          styles.ageItem,
          isSelected && styles.selectedAgeItem
        ]}
        onPress={() => handleSelectAge(item)}
      >
        <Text style={[
          styles.ageText,
          isSelected && styles.selectedAgeText
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleContinue = () => {
    nextStep();
  };

  const handleSkip = () => {
    updateField('age', null);
    nextStep();
  };

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <SafeAreaView style={styles.container}>
      <AssessmentHeader title="What is your age?" />
      
      <View style={styles.content}>
        <View style={styles.agePickerContainer}>
          <View style={styles.agePicker}>
            <View style={styles.highlightBox} />
            
            <FlatList
              ref={flatListRef}
              data={AGES}
              renderItem={renderAgeItem}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              getItemLayout={getItemLayout}
              contentContainerStyle={{
                paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
              }}
            />
          </View>
        </View>
        
        <SkipButton onPress={handleSkip} />
        
        <View style={styles.buttonContainer}>
          <AssessmentButton
            title="Continue"
            onPress={handleContinue}
            icon="arrow-forward"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  agePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    marginVertical: 30,
  },
  agePicker: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: width * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightBox: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -ITEM_HEIGHT / 2 }],
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
  },
  ageItem: {
    height: ITEM_HEIGHT,
    width: width * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAgeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
  },
  ageText: {
    fontSize: 28,
    color: '#666666',
  },
  selectedAgeText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
}); 