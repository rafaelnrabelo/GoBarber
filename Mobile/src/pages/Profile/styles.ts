import styled from "styled-components/native";
import { BorderlessButton } from "react-native-gesture-handler";

export const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  padding: 0 30px;
`;

export const BackButton = styled(BorderlessButton)`
  position: absolute;
  top: 24px;
  left: 24px;
`;

export const LoggoutButton = styled(BorderlessButton)`
  position: absolute;
  top: 24px;
  right: 24px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: "RobotoSlab-Medium";
  margin: 24px 0;
  text-align: left;
`;

export const UserAvatarButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  height: 170px;
  width: 170px;
  border-radius: 85px;
  align-self: center;
  margin-top: 20px;
`;

export const UserAvatarPlaceholder = styled.View`
  height: 170px;
  width: 170px;
  border-radius: 85px;
  align-self: center;
  margin-top: 20px;
  background-color: #3e3b47;
  align-items: center;
  justify-content: center;
`;

export const PasswordContainer = styled.View`
  margin-top: 16px;
`;
