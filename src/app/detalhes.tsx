import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

interface Receita {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  [key: string]: string | null;
}

export default function Detalhes() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [receita, setReceita] = useState<Receita | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarReceita() {
      try {
        const resposta = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );

        const dados = await resposta.json();

        setReceita(dados.meals?.[0] || null);
      } catch (erro) {
        console.log('Erro ao buscar receita:', erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarReceita();
  }, [id]);

  if (carregando) {
    return (
      <View style={estilo.container}>
        <ActivityIndicator size="large" />
        <Text>Carregando receita...</Text>
      </View>
    );
  }

  if (!receita) {
    return (
      <View style={estilo.container}>
        <Text>Receita não encontrada.</Text>
      </View>
    );
  }

  const ingredientes = [];

  for (let i = 1; i <= 20; i++) {
    const nome = receita[`strIngredient${i}`];
    const quantidade = receita[`strMeasure${i}`];

    if (nome && nome.trim() !== '') {
      ingredientes.push(
        `${nome} ${quantidade || ''}`
      );
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Detalhes da receita' }} />

      <ScrollView style={estilo.container}>
        <Image
          source={{ uri: receita.strMealThumb }}
          style={estilo.imagem}
        />

        <View style={estilo.conteudo}>
          <Text style={estilo.titulo}>{receita.strMeal}</Text>

          <Text>Categoria: {receita.strCategory}</Text>
          <Text>Origem: {receita.strArea}</Text>

          <Text style={estilo.subtitulo}>Ingredientes</Text>

          {ingredientes.map((item, index) => (
            <Text key={index} style={estilo.texto}>
              • {item}
            </Text>
          ))}

          <Text style={estilo.subtitulo}>Modo de preparo</Text>

          <Text style={estilo.texto}>
            {receita.strInstructions}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const estilo = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFF8F0',
  },
  imagem: {
    width: '100%',
    height: 220,
    borderRadius: 8,
  },
  conteudo: {
    paddingVertical: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E76F51',
    marginTop: 20,
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
});