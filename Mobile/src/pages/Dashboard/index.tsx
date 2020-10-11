import React, { useEffect, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useAuth } from "../../hooks/Auth";
import { useNotification } from "../../hooks/Notification";

import api from "../../services/api";

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProvidersListPlaceholder,
  ProvidersListTitle,
  ProviderContainer,
  ProviderAvatar,
  ProviderAvatarPlaceholder,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
} from "./styles";

export interface Provider {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const { error, success } = useNotification();
  const { user, signOut } = useAuth();

  const navigation = useNavigation();

  useEffect(() => {
    api.get<Provider[]>("/providers").then((response) => {
      setProviders(response.data);
    });
  }, []);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigation.navigate("CreateAppointment", { providerId, providers });
    },
    [navigation, providers]
  );

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={error ? "#e03837" : success ? "#00b003" : "#28262e"}
      />
      <Container>
        <Header>
          <HeaderTitle>
            Bem-vindo,{"\n"}
            <UserName>{user.name}</UserName>
          </HeaderTitle>
          <ProfileButton
            onPress={() => /* navigation.navigate("Profile") */ signOut()}
          >
            <UserAvatar source={{ uri: user.avatar_url }} />
          </ProfileButton>
        </Header>
        <ProvidersList
          data={providers}
          keyExtractor={(provider) => provider.id}
          ListEmptyComponent={
            <ProvidersListPlaceholder>
              Nenhum cabeleireiro disponível
            </ProvidersListPlaceholder>
          }
          ListHeaderComponent={
            providers.length > 0 ? (
              <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
            ) : null
          }
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => navigateToCreateAppointment(provider.id)}
            >
              {provider.avatar_url ? (
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
              ) : (
                <ProviderAvatarPlaceholder>
                  <Icon name="user" color="#ff9000" size={36} />
                </ProviderAvatarPlaceholder>
              )}
              <ProviderInfo>
                <ProviderName>{provider.name}</ProviderName>
                <ProviderMeta>
                  <Icon name="calendar" size={14} color="#ff9000" />
                  <ProviderMetaText>Segunda à sexta</ProviderMetaText>
                </ProviderMeta>
                <ProviderMeta>
                  <Icon name="clock" size={14} color="#ff9000" />
                  <ProviderMetaText>8h às 18h</ProviderMetaText>
                </ProviderMeta>
              </ProviderInfo>
            </ProviderContainer>
          )}
        />
      </Container>
    </>
  );
};

export default Dashboard;
