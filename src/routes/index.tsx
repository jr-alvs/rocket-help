import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { AppRoutes } from "./app.routes";
import { InitRoutes } from "./init.routes";
import { Loading } from "../components/Loading";

export function Routes() {
  const [ user, setUser ] = useState<FirebaseAuthTypes.User>();
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    return auth().onAuthStateChanged(response => {
      console.log(response);
      setUser(response);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />
  }

  return (
    <NavigationContainer>
      { user
        ? <AppRoutes/> 
        : <InitRoutes />
      }
    </NavigationContainer>
  )
}