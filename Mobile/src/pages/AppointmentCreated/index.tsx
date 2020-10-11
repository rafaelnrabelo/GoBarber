import React, { useCallback, useMemo } from "react";
import { StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useRoute, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { useNotification } from "../../hooks/Notification";

import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from "./styles";

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { error, success } = useNotification();

  const navigation = useNavigation();
  const route = useRoute();
  const { date } = route.params as RouteParams;

  const formatedDate = useMemo(() => {
    return format(date, "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'", {
      locale: ptBR,
    });
  }, [date]);

  const handleOkPressed = useCallback(() => {
    navigation.reset({
      routes: [
        {
          name: "Dashboard",
        },
      ],
      index: 0,
    });
  }, [navigation]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={error ? "#e03837" : success ? "#00b003" : "#312e38"}
      />
      <Container>
        <Icon name="check" size={80} color="#04d361" />
        <Title>Agendamento concluído</Title>
        <Description>{formatedDate}</Description>
        <OkButton onPress={handleOkPressed}>
          <OkButtonText>Ok</OkButtonText>
        </OkButton>
      </Container>
    </>
  );
};

export default AppointmentCreated;
