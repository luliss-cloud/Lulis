import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Button, Card, Heading, Icon, ui, useTheme } from '../components/ui';
import { RecipeCard } from '../components/RecipeCard';
import { recipes } from '../data/recipes';
import { money, planCost, shoppingList } from '../data/planner';
import { useResponsive } from '../components/responsive';
import { useApp } from '../state/AppState';

export function Home({ onRecipe, onShopping, onEdit }: { onRecipe: (id: string, day?: string) => void; onShopping: () => void; onEdit: () => void }) {
  const { state } = useApp();
  const c = useTheme();
  const { wide, columns } = useResponsive();
  const total = planCost(state.plan, state.profile.people);
  const list = shoppingList(state.plan, state.profile.people);
  const checked = list.filter(item => state.checked.includes(item.id)).length;
  return <ScrollView contentContainerStyle={{ padding: wide ? 36 : 20, gap: 24, paddingBottom: 36 }}>
    <View style={{ alignItems: wide ? 'flex-start' : 'center', gap: 5 }}>
      <Text style={{ color: c.muted, fontSize: 11, letterSpacing: 2 }}>BOM DIA</Text>
      <Heading title={`${wide ? 'Olá, ' : ''}${state.profile.name || 'Chef'}!`} />
      {wide && <Text style={{ color: c.muted, fontSize: 16, marginTop: 8 }}>Sua semana organizada, do mercado à mesa.</Text>}
      <View style={[ui.row, { backgroundColor: '#DFEBD9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, marginTop: 14 }]}><Icon name="basket-outline" color="#32643C" size={20} /><Text style={{ color: '#32643C', fontSize: 13, fontWeight: '600' }}>Planejado para {state.profile.market}</Text></View>
    </View>
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Card style={{ flex: 1, justifyContent: 'space-between', gap: 16 }}>
        <Text style={{ color: c.muted, fontSize: 10, letterSpacing: .8 }}>CUSTO ESTIMADO</Text>
        <View><Text style={{ fontSize: 23, color: c.text, fontWeight: '800' }}>{money(total)}</Text><Text style={{ color: c.muted, fontSize: 12 }}>de {money(state.profile.budget)}</Text></View>
        <View style={{ height: 7, borderRadius: 5, backgroundColor: c.border }}><View style={{ height: 7, borderRadius: 5, width: `${Math.min(total / state.profile.budget, 1) * 100}%`, backgroundColor: total > state.profile.budget ? '#D88355' : '#A8D8A1' }} /></View>
      </Card>
      <Pressable accessibilityRole="button" onPress={onShopping} style={{ flex: 1, borderRadius: 18, backgroundColor: '#D6EDF9', padding: 18, justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 10, color: '#47677A' }}>TOQUE PARA VER</Text><Icon name="arrow-up-right-box-outline" size={17} color="#47677A" /></View>
        <Text style={{ fontSize: 23, lineHeight: 26, fontWeight: '800', color: '#233D49' }}>Lista de{ '\n' }compras</Text>
        <Text style={{ fontSize: 12, color: '#47677A' }}>{checked}/{list.length} itens comprados</Text>
      </Pressable>
    </View>
    <Text style={{ fontSize: 12, lineHeight: 18, color: total > state.profile.budget ? '#BA5E36' : c.muted }}>{total > state.profile.budget ? 'O menor custo disponível supera seu orçamento. Ajuste o número de pessoas, os dias ou o valor semanal.' : 'Plano de demonstração · preços e valores nutricionais ilustrativos.'}</Text>
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text accessibilityRole="header" style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>Seu cardápio</Text><Text style={{ color: c.muted, fontSize: 12 }}>{state.plan.length} refeições</Text></View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
      {[...state.plan].sort((a, b) => {
        if (state.preferences.weekStart !== 'Domingo') return 0;
        return Number(b.day === 'Domingo') - Number(a.day === 'Domingo');
      }).map(entry => {
        const recipe = recipes.find(r => r.id === entry.recipeId);
        return recipe ? <View key={entry.day} style={{ width: columns === 3 ? '31.5%' : columns === 2 ? '48%' : '100%' }}><RecipeCard day={entry.day} recipe={recipe} onPress={() => onRecipe(recipe.id, entry.day)} /></View> : null;
      })}
      </View>
      {!state.plan.length && <Card><Text style={{ color: c.muted }}>Nenhuma receita compatível. Ajuste suas preferências para montar um plano.</Text></Card>}
    </View>
    <Button title="Ajustar meu planejamento" secondary icon="options-outline" onPress={onEdit} />
  </ScrollView>;
}
