import React from 'react';
import { StyleSheet, View, Image, Pressable, Dimensions, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';

const CARD_WIDTH = Dimensions.get('window').width * 0.75;

type DestinationCardProps = {
  title: string;
  subtitle?: string;
  location: string;
  country: string;
  rating?: number;
  image: ImageSourcePropType;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
};

export function DestinationCard({
  title,
  subtitle,
  location,
  country,
  rating,
  image,
  isFavorite = false,
  onPress,
  onFavoritePress,
}: DestinationCardProps) {
  const cardBackground = useThemeColor({}, 'cardBackground');
  const secondaryText = useThemeColor({}, 'secondaryText');
  const favoriteColor = useThemeColor({}, 'favoriteIcon');
  const ratingColor = useThemeColor({}, 'ratingIcon');
  const textColor = useThemeColor({}, 'text');
  const colorScheme = useColorScheme();

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        <Pressable style={styles.favoriteButton} onPress={onFavoritePress}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? favoriteColor : '#FFFFFF'}
          />
        </Pressable>
      </View>
      <View style={[
        styles.infoContainer, 
        { backgroundColor: colorScheme === 'dark' ? '#FFFFFF' : '#FFFFFF' }
      ]}>
        <ThemedText style={[styles.title, { color: '#333333' }]}>{title}</ThemedText>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666666" />
          <ThemedText style={[styles.location, { color: '#666666' }]}>
            {location}, {country}
          </ThemedText>
          {rating !== undefined && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={ratingColor} />
              <ThemedText style={[styles.rating, { color: '#333333' }]}>{rating}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    padding: 8,
  },
  infoContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
}); 