import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Button, Chip, Heading, Icon, ui, useTheme } from '../components/ui';
import { goalOptions, markets, weekdays } from '../data/recipes';
import { eligibleRecipes, money } from '../data/planner';
import type { Profile } from '../data/planner';
import { useResponsive } from '../components/responsive';
import { useApp } from '../state/AppState';

export function Onboarding({ onFinish, editing = false, onCancel }: { onFinish: () => void; editing?: boolean; onCancel?: () => void }) {
  const [step, setStep] = useState(editing ? 1 : 0);
  const { state, generate } = useApp();
  const [profile, setProfile] = useState(state.profile);
  const updateProfile = (patch: Partial<Profile>) => setProfile(current => ({ ...current, ...patch }));
  const c = useTheme();
  const { wide } = useResponsive();
  const toggle = (key: 'days' | 'goals' | 'restrictions' | 'appliances', value: string) => {
    let next = profile[key].includes(value) ? profile[key].filter(item => item !== value) : [...profile[key], value];
    if (key === 'goals' && next.length > 3) return;
    if (key === 'restrictions') next = value === 'Nenhuma' ? [] : next;
    updateProfile({ [key]: next });
  };
  const valid = step === 1 ? !!profile.name.trim() : step === 4 ? profile.days.length > 0 : step === 8 ? eligibleRecipes(profile).length > 0 : true;
  const finish = () => { generate({ ...profile, name: profile.name.trim() }); onFinish(); };
  if (step === 0 && wide) return <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 40 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 48 }}>
      <View style={{ flex: 1, gap: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><Icon name="leaf" size={30} color={c.forest} /><Text style={{ fontSize: 27, fontWeight: '800', color: c.forest }}>ComprasFit</Text></View>
        <Text style={{ color: c.forest, fontSize: 12, fontWeight: '700', letterSpacing: 2, marginTop: 20 }}>MAIS SABOR. MENOS COMPLICAÇÃO.</Text>
        <Text accessibilityRole="header" style={{ fontSize: 56, lineHeight: 62, fontWeight: '800', letterSpacing: -2, color: c.text }}>Coma bem.{'\n'}Planeje menos.{'\n'}Viva mais.</Text>
        <Text style={{ color: c.muted, fontSize: 18, lineHeight: 29, maxWidth: 440 }}>Monte seu jantar do seu jeito: dentro do orçamento, com o que você gosta e usando o que já tem na cozinha.</Text>
        <View style={{ maxWidth: 300 }}><Button title="Começar" icon="arrow-forward" onPress={() => setStep(1)} /></View>
        <Text style={{ color: c.muted, fontSize: 12 }}>Seu cardápio e suas compras, juntos em um só lugar.</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: '#F1EEDF', borderRadius: 36, padding: 20 }}><Image source={require('../../assets/welcome.jpg')} style={{ width: '100%', height: 540 }} resizeMode="contain" accessibilityLabel="Planejamento de refeições ComprasFit" /></View>
    </View>
  </ScrollView>;
  if (step === 0) return <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 28, alignItems: 'center' }}>
      <Image source={require('../../assets/welcome.jpg')} style={{ width: '100%', height: 370 }} resizeMode="contain" accessibilityLabel="ComprasFit: planejamento de refeições e lista de compras" />
      <Text style={{ color: c.text, fontSize: 35, fontWeight: '800', textAlign: 'center', letterSpacing: -1 }}>Coma bem.</Text>
      <Text style={{ color: c.text, fontSize: 29, textAlign: 'center', lineHeight: 39 }}>Planeje menos.{ '\n' }Viva mais.</Text>
      <Text style={{ color: c.muted, textAlign: 'center', fontSize: 16, lineHeight: 24, marginTop: 20 }}>Monte seu jantar do seu jeito: dentro do orçamento, com o que você gosta e usando o que já tem na cozinha.</Text>
    </ScrollView>
    <View style={{ padding: 24 }}><Button title="Começar" icon="arrow-forward" onPress={() => setStep(1)} /></View>
  </View>;
  const titles = ['','Qual é seu nome?', 'Escolha seu supermercado', 'Para quantas pessoas você cozinha?', 'Em quais dias você vai cozinhar?', 'Qual é seu orçamento semanal?', 'Qual é seu objetivo?', 'Alguma restrição alimentar?', 'Quais eletrodomésticos você possui?'];
  const subtitles = ['', 'Vamos deixar tudo com a sua cara.', 'Seu mercado favorito para planejar a semana.', 'Selecione o número de pessoas.', 'Escolha os dias das suas refeições planejadas.', 'Escolha quanto você quer investir nas refeições.', 'Escolha até 3 opções que combinam com você.', 'Selecione todas que se aplicam.', 'Selecione pelo menos um para o planejamento.'];
  return <View style={{ flex: 1, width: '100%', maxWidth: wide ? 660 : undefined, alignSelf: 'center', paddingVertical: wide ? 20 : 0 }}>
    <View style={[ui.row, { padding: 24 }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => step === 1 && editing ? onCancel?.() : setStep(step - 1)} hitSlop={12}><Icon name="arrow-back" color={c.text} /></Pressable>
      <View style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: c.border }}><View style={{ height: 4, borderRadius: 4, backgroundColor: c.green, width: `${step / 8 * 100}%` }} /></View>
      <Text style={{ color: c.muted, fontSize: 12 }}>{step}/8</Text>
    </View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 26, paddingBottom: 24, flexGrow: 1 }}>
      <Heading title={titles[step]!} subtitle={subtitles[step]} />
      <View style={{ flex: 1, justifyContent: step === 1 || step === 2 ? 'flex-start' : 'center', paddingVertical: 32, gap: 16 }}>
        {step === 1 && <TextInput accessibilityLabel="Seu nome" placeholder="Digite aqui" placeholderTextColor={c.muted} value={profile.name} onChangeText={name => updateProfile({ name })} autoCapitalize="words" maxLength={50} returnKeyType="next" onSubmitEditing={() => valid && setStep(2)} style={{ backgroundColor: c.white, color: c.text, borderWidth: 1, borderColor: c.border, borderRadius: 12, padding: 18, fontSize: 18 }} />}
        {step === 2 && <><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{markets.map((market, i) => <View key={market} style={{ width: '30%', flexGrow: 1 }}><Chip title={market} emoji={['🛒','🏪','🛍️','🌿','🛒','🏪','🛍️','🏪','🛒'][i]} selected={profile.market === market} onPress={() => updateProfile({ market })} /></View>)}</View><Text style={{ color: c.muted, fontSize: 12 }}>Seleção ilustrativa. Sem consulta de preços ou vínculo com os mercados.</Text></>}
        {step === 3 && <><View style={[ui.row, { justifyContent: 'center', gap: 35 }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Diminuir pessoas" disabled={profile.people <= 1} onPress={() => updateProfile({ people: profile.people - 1 })} style={{ padding: 12, backgroundColor: c.white, borderRadius: 30, opacity: profile.people <= 1 ? .35 : 1 }}><Icon name="remove" color={c.text} /></Pressable>
          <Text style={{ fontSize: 72, fontWeight: '800', color: c.text }}>{profile.people}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Aumentar pessoas" disabled={profile.people >= 12} onPress={() => updateProfile({ people: profile.people + 1 })} style={{ padding: 12, backgroundColor: c.white, borderRadius: 30, opacity: profile.people >= 12 ? .35 : 1 }}><Icon name="add" color={c.text} /></Pressable>
        </View><Text style={{ textAlign: 'center', color: c.muted }}>{profile.people === 1 ? 'pessoa' : 'pessoas'}</Text></>}
        {step === 4 && <><Text style={{ textAlign: 'center', color: c.muted }}>{profile.days.length} dias selecionados</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{weekdays.map(day => <View key={day} style={{ width: '46%', flexGrow: 1 }}><Chip title={day} selected={profile.days.includes(day)} onPress={() => toggle('days', day)} /></View>)}</View></>}
        {step === 5 && <><Text style={{ fontSize: 56, fontWeight: '800', textAlign: 'center', color: c.text }}>{money(profile.budget)}</Text><Text style={{ textAlign: 'center', color: c.muted }}>para as refeições desta semana</Text><Slider accessibilityLabel="Orçamento semanal" minimumValue={30} maximumValue={750} step={5} value={profile.budget} onValueChange={budget => updateProfile({ budget })} minimumTrackTintColor={c.green} maximumTrackTintColor={c.border} thumbTintColor={c.green} style={{ width: '100%', height: 48 }} /><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: c.muted }}>R$ 30</Text><Text style={{ color: c.muted }}>R$ 750</Text></View></>}
        {step === 6 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{goalOptions.map(goal => <View key={goal.name} style={{ width: '46%', flexGrow: 1 }}><Chip title={goal.name} emoji={goal.emoji} color={goal.color} selected={profile.goals.includes(goal.name)} onPress={() => toggle('goals', goal.name)} /></View>)}</View>}
        {step === 7 && <><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{['Nenhuma', 'Vegetariano', 'Vegano', 'Peixe', 'Glúten'].map((restriction, i) => <View key={restriction} style={{ width: '46%', flexGrow: 1 }}><Chip title={restriction} emoji={['🍽️','🥕','🥬','🐟','🌾'][i]} selected={restriction === 'Nenhuma' ? !profile.restrictions.length : profile.restrictions.includes(restriction)} onPress={() => toggle('restrictions', restriction)} /></View>)}</View><Text style={{ color: c.muted, fontSize: 12 }}>Opções disponíveis nesta demonstração. Confira sempre os ingredientes; o app não garante ausência de alérgenos.</Text></>}
        {step === 8 && <><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{['Fogão', 'Micro-ondas', 'Air fryer', 'Forno'].map((appliance, i) => <View key={appliance} style={{ width: '46%', flexGrow: 1 }}><Chip title={appliance} emoji={['🍳','♨️','🥘','🍞'][i]} selected={profile.appliances.includes(appliance)} onPress={() => toggle('appliances', appliance)} /></View>)}</View>{!valid && <Text style={{ color: '#B44335', lineHeight: 22 }}>As receitas de demonstração precisam de fogão; a salada também pode ser preparada no micro-ondas. Escolha um equipamento compatível ou volte para ajustar as restrições.</Text>}</>}
      </View>
    </ScrollView>
    <View style={{ padding: 24 }}><Button title={step === 8 ? 'Montar minha semana' : 'Continuar'} disabled={!valid} onPress={() => step === 8 ? finish() : setStep(step + 1)} icon="arrow-forward" /></View>
  </View>;
}
