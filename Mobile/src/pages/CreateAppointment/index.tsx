import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import Icon from "react-native-vector-icons/Feather";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StatusBar, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, isWeekend } from "date-fns";

import { Provider } from "../Dashboard";

import { useAuth } from "../../hooks/Auth";
import { useNotification } from "../../hooks/Notification";

import api from "../../services/api";

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  UserAvatarPlaceholder,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderWrapper,
  ProviderAvatar,
  ProviderAvatarPlaceholder,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from "./styles";

interface RouteParams {
  providerId: string;
  providers: Provider[];
}

interface HourAvailability {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const { error, success, addNotification } = useNotification();

  const navigation = useNavigation();
  const route = useRoute();
  const {
    providerId: routeProviderId,
    providers,
  } = route.params as RouteParams;

  const [selectedProvider, setSelectedProvider] = useState(routeProviderId);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [dayAvailability, setDayAvailability] = useState<HourAvailability[]>(
    []
  );

  const [selectedHour, setSelectedHour] = useState<number>(0);

  const scrollRef = useRef<FlatList<Provider>>(null);
  const [itemWidths, setItemWidths] = useState<number[]>([]);

  const morningAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          hourFomatted: format(new Date().setHours(hour), "HH:00"),
          available,
        };
      });
  }, [dayAvailability]);

  const afternoonAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          hourFomatted: format(new Date().setHours(hour), "HH:00"),
          available,
        };
      });
  }, [dayAvailability]);

  useEffect(() => {
    const selectedIndex = providers.findIndex(
      (provider) => provider.id === selectedProvider
    );

    setTimeout(() => {
      scrollRef.current?.scrollToIndex({
        animated: true,
        index: selectedIndex,
      });
    }, 300);
  }, []);

  useEffect(() => {
    api
      .get<HourAvailability[]>(
        `/providers/${selectedProvider}/day-availability`,
        {
          params: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        }
      )
      .then((response) => {
        if (isWeekend(selectedDate)) {
          const unavailableDay = response.data.map(({ hour }) => ({
            hour,
            available: false,
          }));
          setDayAvailability(unavailableDay);
        } else {
          setDayAvailability(response.data);
        }
      });
  }, [selectedDate, selectedProvider]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedHour(0);
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((old_state) => !old_state);
  }, []);

  const handleDateChange = useCallback((event: any, date?: Date) => {
    handleToggleDatePicker();

    if (date) {
      setSelectedDate(date);
      setSelectedHour(0);
    }
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    if (selectedHour === 0) {
      addNotification({
        title: "Erro na criação do agendamento",
        description: "O horário do agendamento deve ser selecionado",
        type: "error",
      });
    } else {
      try {
        const date = selectedDate;

        date.setHours(selectedHour);
        date.setMinutes(0);

        await api.post("appointments", {
          provider_id: selectedProvider,
          date,
        });

        navigation.navigate("AppointmentCreated", { date: date.getTime() });
      } catch (err) {
        addNotification({
          title: "Erro na criação do agendamento",
          description: "Erro ao tentar criar o agendamento, tente novamente",
          type: "error",
        });
      }
    }
  }, [selectedHour, selectedDate]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={error ? "#e03837" : success ? "#00b003" : "#28262e"}
      />
      <Container>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" color="#999591" size={28} />
          </BackButton>
          <HeaderTitle>Cabeleireiros</HeaderTitle>
          {user.avatar_url ? (
            <UserAvatar source={{ uri: user.avatar_url }} />
          ) : (
            <UserAvatarPlaceholder>
              <Icon name="user" color="#ff9000" size={32} />
            </UserAvatarPlaceholder>
          )}
        </Header>
        <Content>
          <ProvidersListContainer>
            <ProvidersList
              ref={scrollRef}
              getItemLayout={(data, index) => {
                const length = itemWidths[index];
                const offset = itemWidths
                  .slice(0, index)
                  .reduce((a, c) => a + c, 0);
                return { length, offset, index };
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={providers}
              keyExtractor={(provider) => provider.id}
              renderItem={({ item: provider, index }) => (
                <ProviderContainer
                  onPress={() => handleSelectProvider(provider.id)}
                  selected={selectedProvider === provider.id}
                >
                  <ProviderWrapper
                    onLayout={(object) => {
                      let newItemWidths = itemWidths;
                      newItemWidths[index] = object.nativeEvent.layout.width;
                      setItemWidths(newItemWidths);
                    }}
                  >
                    {provider.avatar_url ? (
                      <ProviderAvatar source={{ uri: provider.avatar_url }} />
                    ) : (
                      <ProviderAvatarPlaceholder>
                        <Icon name="user" color="#ff9000" size={18} />
                      </ProviderAvatarPlaceholder>
                    )}
                    <ProviderName selected={selectedProvider === provider.id}>
                      {provider.name}
                    </ProviderName>
                  </ProviderWrapper>
                </ProviderContainer>
              )}
            />
          </ProvidersListContainer>
          <Calendar>
            <Title>Escolha a data</Title>
            <OpenDatePickerButton onPress={handleToggleDatePicker}>
              <OpenDatePickerButtonText>
                Selecionar outra data
              </OpenDatePickerButtonText>
            </OpenDatePickerButton>
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                display="calendar"
                value={selectedDate}
                onChange={handleDateChange}
              />
            )}
          </Calendar>

          <Schedule>
            <Title>Escolha o horário</Title>
            <Section>
              <SectionTitle>Manhã</SectionTitle>
              <SectionContent>
                {morningAvailability.map(
                  ({ hourFomatted, hour, available }) => (
                    <Hour
                      onPress={() => handleSelectHour(hour)}
                      enabled={available}
                      available={available}
                      selected={hour === selectedHour}
                      key={hourFomatted}
                    >
                      <HourText selected={hour === selectedHour}>
                        {hourFomatted}
                      </HourText>
                    </Hour>
                  )
                )}
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>Tarde</SectionTitle>
              <SectionContent>
                {afternoonAvailability.map(
                  ({ hourFomatted, hour, available }) => (
                    <Hour
                      onPress={() => handleSelectHour(hour)}
                      enabled={available}
                      available={available}
                      selected={hour === selectedHour}
                      key={hourFomatted}
                    >
                      <HourText selected={hour === selectedHour}>
                        {hourFomatted}
                      </HourText>
                    </Hour>
                  )
                )}
              </SectionContent>
            </Section>
          </Schedule>
          <CreateAppointmentButton onPress={handleCreateAppointment}>
            <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
          </CreateAppointmentButton>
        </Content>
      </Container>
    </>
  );
};

export default CreateAppointment;
