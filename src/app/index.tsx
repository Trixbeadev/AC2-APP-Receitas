import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface Receita {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
}

export default function App() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarReceitas() {
      try {
        const resposta = await fetch(
          'https://www.themealdb.com/api/json/v1/1/search.php?f=a'
        );

        const dados = await resposta.json();

        setReceitas(dados.meals || []);
      } catch (erro) {
        console.log('Erro ao buscar receitas:', erro);
      }

      setCarregando(false);
    }

    buscarReceitas();
  }, []);

  if (carregando) {
    return (
      <View style={estilo.container}>
        <ActivityIndicator size="large" />
        <Text>Carregando receitas...</Text>
      </View>
    );
  }

  return (
    <View style={estilo.container}>
      <Text style={estilo.titulo}>Receitas</Text>

      <FlatList
        data={receitas}
        keyExtractor={(item) => item.idMeal}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={estilo.card}>
            <Image
              source={{ uri: item.strMealThumb }}
              style={estilo.imagem}
            />

            <Text style={estilo.nome}>{item.strMeal}</Text>

            <Text>{item.strCategory}</Text>

            <Pressable
              style={estilo.botao}
              onPress={() =>
                router.push({
                  pathname: '/detalhes',
                  params: { id: item.idMeal },
                })
              }
            >
              <Text style={estilo.textoBotao}>Ver detalhes</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text>Nenhuma receita encontrada.</Text>
        }
      />
    </View>
  );
}

const estilo = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 50,
    backgroundColor: '#FFF8F0',
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  imagem: {
    width: '100%',
    height: 120,
    borderRadius: 5,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 5,
  },
  botao: {
    backgroundColor: '#E76F51',
    padding: 8,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
  },
});