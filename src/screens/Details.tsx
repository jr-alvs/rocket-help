import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText  } from 'phosphor-react-native';

import { OrderDTO } from '../DTOs/OrderDTO';
import { dateFormat } from '../utils/firestoreDateFormat';

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ solutionOrder, setSolutionOrder ] = useState('');
  const [ order, setOrder ] = useState<OrderDetails>({} as OrderDetails);

  const route = useRoute();
  const { orderId } = route.params as RouteParams;
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleOrderClose(){
    if (!solutionOrder) {
      return Alert.alert('Solicitação', 'Informe a solução para encerrar a solicitação.');
    }

    firestore()
    .collection<OrderDTO>('orders')
    .doc(orderId)
    .update({
      status: 'closed',
      solution: solutionOrder,
      closed_at: firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      Alert.alert('Solicitação', 'Solicitação encerrada com sucesso.');
      navigation.goBack();
    })
    .catch((error) =>{
      console.log(error);
      setIsLoading(false);
      return Alert.alert('Solicitação','Não foi possível encerrar a solicitação.');
    })
  }

  useEffect(() => {
    firestore()
    .collection<OrderDTO>('orders')
    .doc(orderId)
    .get()
    .then((doc) => {
      const { patrimony, description, status, solution, created_at, closed_at } = doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed
      });

      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed' 
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }

        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          { order.status === 'closed' ? 'Finalizado' : 'Em andamento'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title='Equipamento'
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
        />

        <CardDetails
          title='Descrição do problema'
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />

        <CardDetails
          title='Solução'
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed &&`Encerrado em ${order.closed}`}
        >
          { order.status === 'open' &&
            <Input
              placeholder='Descrição da solução'
              onChangeText={setSolutionOrder}
              textAlignVertical='top'
              multiline
              h={24}
            />
          }
        </CardDetails>
      </ScrollView>

      { order.status === 'open' &&
        <Button
          title='Encerrar Solicitação'
          m={5}
          onPress={handleOrderClose}
        />
      }

    </VStack>
  );
}