import React, { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/state/AppState';
import { Icon, useTheme } from './src/components/ui';
import { Onboarding } from './src/screens/Onboarding';
import { Home } from './src/screens/Home';
import { Shopping } from './src/screens/Shopping';
import { RecipeDetails } from './src/screens/RecipeDetails';
import { Preferences, Settings } from './src/screens/Settings';
import { ScrollView } from 'react-native';
import { RecipeCard } from './src/components/RecipeCard';
import { recipes } from './src/data/recipes';
import { useResponsive } from './src/components/responsive';

type Tab = 'home' | 'favorites' | 'preferences' | 'settings';
type Screen = { type: 'tab' } | { type: 'shopping' } | { type: 'edit' } | { type: 'recipe'; id: string; day?: string };
const tabs: { id: Tab; label: string; icon: React.ComponentProps<typeof Icon>['name']; active: React.ComponentProps<typeof Icon>['name'] }[] = [
  { id: 'home', label: 'Início', icon: 'reader-outline', active: 'reader' },
  { id: 'favorites', label: 'Favoritos', icon: 'heart-outline', active: 'heart' },
  { id: 'preferences', label: 'Preferências', icon: 'star-outline', active: 'star' },
  { id: 'settings', label: 'Configurações', icon: 'settings-outline', active: 'settings' },
];

function Main() {
  const { state, loaded, storageError } = useApp();
  const c = useTheme();
  const { wide, columns } = useResponsive();
  const [tab, setTab] = useState<Tab>('home');
  const [screen, setScreen] = useState<Screen>({ type: 'tab' });
  useEffect(() => {
    if (!state.completed) { setScreen({ type: 'tab' }); setTab('home'); }
  }, [state.completed]);
  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen.type !== 'tab') { setScreen({ type: 'tab' }); return true; }
      if (tab !== 'home') { setTab('home'); return true; }
      return false;
    });
    return () => listener.remove();
  }, [screen, tab]);
  const onRecipe = (id: string, day?: string) => setScreen({ type: 'recipe', id, day });
  const finish = () => { setScreen({ type: 'tab' }); setTab('home'); };
  let content: React.ReactNode;
  if (!loaded) content = <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={c.green} size="large" /><Text style={{ color: c.muted, marginTop: 15 }}>Preparando sua cozinha…</Text></View>;
  else if (!state.completed || screen.type === 'edit') content = <Onboarding onFinish={finish} editing={state.completed} onCancel={() => setScreen({ type: 'tab' })} />;
  else if (screen.type === 'recipe') content = <RecipeDetails id={screen.id} day={screen.day} onBack={() => setScreen({ type: 'tab' })} onReplace={id => setScreen({ ...screen, id })} />;
  else if (screen.type === 'shopping') content = <><Pressable accessibilityRole="button" accessibilityLabel="Voltar ao início" onPress={() => setScreen({ type: 'tab' })} style={{ paddingHorizontal: 24, paddingTop: 18 }}><Icon name="arrow-back" color={c.text} /></Pressable><Shopping /></>;
  else if (tab === 'home') content = <Home onRecipe={onRecipe} onShopping={() => setScreen({ type: 'shopping' })} onEdit={() => setScreen({ type: 'edit' })} />;
  else if (tab === 'favorites') content = <ScrollView contentContainerStyle={{ padding: 24, gap: 18 }}><Text accessibilityRole="header" style={{ fontSize: 27, color: c.text, fontWeight: '800' }}>Meus favoritos</Text><Text style={{ color: c.muted }}>Suas receitas preferidas, sempre à mão.</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}>{recipes.filter(r => state.favorites.includes(r.id)).map(recipe => <View key={recipe.id} style={{ width: columns === 3 ? '31.5%' : columns === 2 ? '48%' : '100%' }}><RecipeCard recipe={recipe} onPress={() => onRecipe(recipe.id)} /></View>)}</View>{!state.favorites.length && <View style={{ alignItems: 'center', gap: 18, padding: 40 }}><Icon name="heart-outline" color={c.green} size={48} /><Text style={{ textAlign: 'center', color: c.muted, lineHeight: 22 }}>Toque no coração de uma receita para guardar seus pratos favoritos aqui.</Text></View>}</ScrollView>;
  else if (tab === 'preferences') content = <Preferences />;
  else content = <Settings onEdit={() => setScreen({ type: 'edit' })} />;
  return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
    <StatusBar style={state.preferences.dark ? 'light' : 'dark'} />
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      {!!storageError && <Text accessibilityRole="alert" style={{ padding: 12, backgroundColor: '#FBE3CF', color: '#703D1E', fontSize: 12 }}>{storageError}</Text>}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {wide && loaded && state.completed && screen.type !== 'edit' && <View style={{ width: 232, backgroundColor: c.white, borderRightWidth: 1, borderColor: c.border, padding: 22, gap: 30 }}>
          <View style={{ gap: 10, paddingVertical: 12 }}><Icon name="leaf" size={32} color={c.forest} /><Text style={{ color: c.forest, fontSize: 25, fontWeight: '800', letterSpacing: -1 }}>ComprasFit</Text><Text style={{ color: c.muted, fontSize: 12 }}>Sua semana mais leve.</Text></View>
          <View accessibilityRole="tablist" style={{ gap: 8 }}>{tabs.map(item => <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={item.label} aria-selected={screen.type === 'tab' && tab === item.id} onPress={() => { setScreen({ type: 'tab' }); setTab(item.id); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, backgroundColor: screen.type === 'tab' && tab === item.id ? '#E3EDC8' : c.white }}><Icon name={item.icon} color={screen.type === 'tab' && tab === item.id ? '#32643C' : c.muted} /><Text style={{ color: screen.type === 'tab' && tab === item.id ? '#32643C' : c.text, fontWeight: '600', fontSize: 13 }}>{item.label}</Text></Pressable>)}</View>
          <View style={{ marginTop: 'auto', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: c.border, gap: 8 }}><Text style={{ color: c.text, fontWeight: '700' }}>{state.profile.name}</Text><Text style={{ color: c.muted, fontSize: 12, lineHeight: 18 }}>Coma bem. Planeje menos. Viva mais.</Text></View>
        </View>}
        <View style={{ flex: 1, minWidth: 0, alignItems: 'center' }}><View style={{ flex: 1, width: '100%', maxWidth: state.completed && screen.type !== 'edit' ? 1240 : wide ? 1120 : 600 }}>{content}</View></View>
      </View>
      {!wide && loaded && state.completed && screen.type === 'tab' && <View accessibilityRole="tablist" style={{ flexDirection: 'row', backgroundColor: c.white, borderTopWidth: 1, borderColor: c.border, paddingVertical: 10 }}>{tabs.map(item => <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected: item.id === tab }} aria-selected={item.id === tab} onPress={() => setTab(item.id)} style={{ flex: 1, alignItems: 'center', gap: 5, minHeight: 49, justifyContent: 'center' }}><Icon name={item.id === tab ? item.active : item.icon} color={item.id === tab ? c.green : c.muted} size={24} /><Text style={{ fontSize: 10, color: item.id === tab ? c.green : c.muted, fontWeight: item.id === tab ? '700' : '400' }}>{item.label}</Text></Pressable>)}</View>}
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

export default function App() {
  return <SafeAreaProvider><AppProvider><View style={{ flex: 1, backgroundColor: '#E8EBE3', alignItems: 'center' }}><View style={{ flex: 1, width: '100%' }}><Main /></View></View></AppProvider></SafeAreaProvider>;
}
