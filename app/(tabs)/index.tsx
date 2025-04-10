import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable, StatusBar, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SearchBar } from '@/components/SearchBar';
import { CategoryTabs } from '@/components/CategoryTabs';
import { DestinationCard } from '@/components/DestinationCard';
import { useThemeColor } from '@/hooks/useThemeColor';

// Sample data for destinations
const destinations = [
  {
    id: '1',
    title: 'Tokyo',
    location: 'Tokyo',
    country: 'Japan',
    rating: 4.8,
    image: require('@/assets/images/partial-react-logo.png'), // Placeholder until we add actual images
    isFavorite: false,
  },
  {
    id: '2',
    title: 'South',
    location: 'South',
    country: 'America',
    rating: 4.7,
    image: require('@/assets/images/partial-react-logo.png'), // Placeholder until we add actual images
    isFavorite: true,
  },
];

// Sample data for category tabs
const categoryTabs = [
  { id: 'most-viewed', label: 'Most Viewed' },
  { id: 'nearby', label: 'Nearby' },
  { id: 'latest', label: 'Latest' },
];

export default function HomeScreen() {
  const [favorites, setFavorites] = useState<string[]>([destinations[1].id]);
  const secondaryText = useThemeColor({}, 'secondaryText');
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  return (
    <View style={[styles.rootContainer, { backgroundColor }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Create a spacer for the status bar */}
      <View style={{ height: insets.top }} />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>
              Hi, David 👋
            </Text>
            <Text style={styles.subtitleText}>
              Explore the world
            </Text>
          </View>
          
          <Pressable style={styles.profileButton}>
            <Image 
              source={require('@/assets/images/partial-react-logo.png')} 
              style={styles.profileImage}
            />
          </Pressable>
        </View>

        {/* Search Bar */}
        <SearchBar 
          placeholder="Search places" 
          onPress={() => console.log('Search pressed')} 
        />

        {/* Popular Places Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular places</Text>
          <Pressable>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>

        {/* Category Tabs */}
        <CategoryTabs 
          tabs={categoryTabs} 
          onTabChange={(tab) => console.log('Tab changed:', tab.id)} 
        />

        {/* Destinations */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.destinationsContainer}>
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              title={destination.title}
              location={destination.location}
              country={destination.country}
              rating={destination.rating}
              image={destination.image}
              isFavorite={favorites.includes(destination.id)}
              onPress={() => console.log('Destination pressed:', destination.id)}
              onFavoritePress={() => toggleFavorite(destination.id)}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Increased to accommodate the custom tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
  greetingText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitleText: {
    fontSize: 16,
    marginTop: 4,
    color: '#AAAAAA',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewAll: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  destinationsContainer: {
    paddingBottom: 20,
  },
});
