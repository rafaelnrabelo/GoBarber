import styled from "styled-components/native";
import { Provider } from "./index";
import { FlatList } from "react-native";
import { RectButton } from "react-native-gesture-handler";

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  background-color: #28262e;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 20px;
  font-family: "RobotoSlab-Regular";
  line-height: 28px;
`;

export const UserName = styled.Text`
  color: #ff9000;
  font-family: "RobotoSlab-Medium";
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  height: 56px;
  width: 56px;
  border-radius: 28px;
`;

export const UserAvatarPlaceholder = styled.View`
  height: 56px;
  width: 56px;
  border-radius: 28px;
  background-color: #3e3c43;
  align-items: center;
  justify-content: center;
`;

export const ProvidersList = styled(
  FlatList as new () => FlatList<Provider>
).attrs({
  contentContainerStyle: {
    paddingBottom: 16,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
})``;

export const ProviderContainer = styled(RectButton)`
  background-color: #3e3b47;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
`;

export const ProvidersListPlaceholder = styled.Text`
  color: rgba(153, 149, 145, 0.6);
  font-family: "RobotoSlab-Medium";
  font-size: 18px;
  align-self: center;
`;

export const ProvidersListTitle = styled.Text`
  font-family: "RobotoSlab-Medium";
  font-size: 24px;
  margin-bottom: 24px;
  color: #f4ede8;
`;

export const ProviderAvatar = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 36px;
`;

export const ProviderAvatarPlaceholder = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background-color: #4c4954;
  align-items: center;
  justify-content: center;
`;

export const ProviderInfo = styled.View`
  flex: 1;
  margin-left: 20px;
`;

export const ProviderName = styled.Text`
  font-family: "RobotoSlab-Medium";
  font-size: 18px;
  color: #f4ede8;
`;

export const ProviderMeta = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const ProviderMetaText = styled.Text`
  margin-left: 8px;
  color: #999591;
  font-family: "RobotoSlab-Regular";
`;
