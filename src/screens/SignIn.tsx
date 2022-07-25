import { useState } from 'react';
import { Alert } from 'react-native';
import { Heading, VStack, Icon, useTheme } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Envelope, Key } from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';

import Logo from '../assets/logo_primary.svg';

import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function SignIn () {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);

  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Entrar','Informe e-mail e senha.');
    }

    setIsLoading(true);

    auth()
    .signInWithEmailAndPassword(email, password)
    .catch((error) => {
      setIsLoading(false);

      if (error.code === 'auth/invalid-email') {
        return Alert.alert('Entrar','E-mail ou senha inválida.');
      }

      if (error.code === 'auth/wrong-password') {
        return Alert.alert('Entrar','E-mail ou senha inválida.');
      }

      if (error.code === 'auth/user-not-found') {
        return Alert.alert('Entrar','Dados inválidos.');
      }

      return Alert.alert('Entrar','Não foi possível acessar.');
    });
  }

  function handleSignUp() {
    navigation.navigate('signup');
  }

  return(
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

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
        mb={9}
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
        onPress={handleSignUp}
        isLoading={isLoading}
        bg={colors.primary[700]}
        mb={5}
      />

      <Button
        title="Entrar"
        w="full"
        onPress={handleSignIn}
        isLoading={isLoading}
      />
    </VStack>
  )
}