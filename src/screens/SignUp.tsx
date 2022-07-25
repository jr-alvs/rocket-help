import { useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Icon, useTheme } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Envelope, Key } from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Header } from '../components/Header';

export function SignUp() {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const navigation = useNavigation();

  const { colors } = useTheme();
  
  function handleNewUser() {
    if (!email || !password) {
      return Alert.alert('Cadastro','Informe os dados de cadastro.');
    }

    setIsLoading(true);

    auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      Alert.alert('Cadastro', 'Usuário cadastrado com sucesso.');
      navigation.goBack();
    })
    .catch((error) =>{
      console.log(error);
      setIsLoading(false);

      if (error.code === 'auth/invalid-email') {
        return Alert.alert('Cadastro','E-mail inválido.');
      }

      if (error.code === 'auth/weak-password') {
        return Alert.alert('Cadastro','A senha deve ter pelo menos 6 caracteres.');
      }

      if (error.code === 'auth/email-already-in-use') {
        return Alert.alert('Cadastro','O e-mail não está disponivel.');
      }

      return Alert.alert('Cadastro','Não foi possível cadastrar o usuário.');
    })
  }  

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Header title="Cadastro" />

      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={
            <Envelope 
              color={colors.gray[300]}
            /> }
            ml={4}
          />
        }
        onChangeText={setEmail}
      />

      <Input
        placeholder="Senha"
        mb={8}
        InputLeftElement={
          <Icon as={
            <Key 
              color={colors.gray[300]}
            /> }
            ml={4}
          />
        }
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button
        title="Cadastrar"
        w="full"
        onPress={handleNewUser}
        isLoading={isLoading}
      />
    </VStack>
  );
}