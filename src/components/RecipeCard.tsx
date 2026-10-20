import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { type Recipe } from '../data/recipes';
import { recipeImages } from '../data/images';
import { money } from '../data/planner';
import { Card, Icon, ui, useTheme } from './ui';
import { useApp } from '../state/AppState';

export function RecipeCard({ recipe, day, onPress }: { recipe: Recipe; day?: string; onPress: () => void }) {
  const c = useTheme();
  const { state, toggleFavorite } = useApp();
  return <View style={{ gap: 8 }}>
    {day && <Text style={{ fontSize: 12, color: c.muted, textAlign: 'center', fontWeight: '600' }}>{day}</Text>}
    <Card style={{ padding: 12 }}>
      <View style={ui.row}>
        <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Ver receita: ${recipe.name}`} style={[ui.row, { flex: 1 }]}>
          <Image source={recipeImages[recipe.id]} style={{ width: 78, height: 88, borderRadius: 12 }} />
          <View style={{ flex: 1, gap: 7 }}>
            <Text style={{ color: c.text, fontSize: 16, fontWeight: '700', lineHeight: 21 }}>{recipe.name}</Text>
            <Text style={{ alignSelf: 'flex-start', overflow: 'hidden', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, fontSize: 11, color: '#3D3542', backgroundColor: recipe.color }}>{recipe.tag}</Text>
            <Text style={{ color: c.muted, fontSize: 11 }}>{recipe.minutes} min · {state.profile.people} {state.profile.people === 1 ? 'pessoa' : 'pessoas'} · {money(recipe.cost * state.profile.people)}</Text>
          </View>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={state.favorites.includes(recipe.id) ? `Remover ${recipe.name} dos favoritos` : `Favoritar ${recipe.name}`} onPress={() => toggleFavorite(recipe.id)} hitSlop={12} style={{ alignSelf: 'flex-start', padding: 4 }}>
          <Icon name={state.favorites.includes(recipe.id) ? 'heart' : 'heart-outline'} size={20} color={state.favorites.includes(recipe.id) ? '#C65C69' : c.muted} />
        </Pressable>
      </View>
    </Card>
  </View>;
}
