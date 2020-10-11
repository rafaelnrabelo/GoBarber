import styled from "styled-components/native";
import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import { FlatList } from "react-native";

import { Provider } from "../Dashboard";

interface SelectedProps {
  selected: boolean;
}

interface AvailableProps {
  available: boolean;
}

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

export const BackButton = styled(BorderlessButton)``;

export const HeaderTitle = styled.Text`
  font-size: 20px;
  font-family: "RobotoSlab-Medium";
  color: #f4ede8;
  margin-left: 16px;
`;

export const UserAvatar = styled.Image`
  height: 56px;
  width: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const Content = styled.ScrollView``;

export const ProvidersListContainer = styled.View`
  height: 112px;
`;

export const ProvidersList = styled(
  FlatList as new () => FlatList<Provider>
).attrs({
  contentContainerStyle: {
    paddingBottom: 32,
    paddingTop: 32,
    paddingRight: 8,
    paddingLeft: 24,
  },
})``;

export const ProviderContainer = styled(RectButton)<SelectedProps>`
  background-color: ${(props) => (props.selected ? "#ff9000" : "#3e3b47")};
  border-radius: 10px;
  margin-right: 16px;
`;

export const ProviderWrapper = styled.View`
  padding: 8px 12px;
  flex-direction: row;
  align-items: center;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const ProviderAvatarPlaceholder = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #4c4954;
  align-items: center;
  justify-content: center;
`;

export const ProviderName = styled.Text<SelectedProps>`
  font-family: "RobotoSlab-Medium";
  font-size: 16px;
  color: ${(props) => (props.selected ? "#232129" : "#f4ede8")};
  margin-left: 10px;
`;

export const Calendar = styled.View``;

export const Title = styled.Text`
  font-family: "RobotoSlab-Medium";
  color: #f4ede8;
  font-size: 24px;
  margin: 0 24px 16px;
`;

export const OpenDatePickerButton = styled(RectButton)`
  height: 46px;
  background-color: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 24px;
`;

export const OpenDatePickerButtonText = styled.Text`
  font-family: "RobotoSlab-Medium";
  font-size: 16px;
  color: #232129;
`;

export const Schedule = styled.View`
  padding: 24px 0 16px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #999591;
  font-family: "RobotoSlab-Regular";
  margin: 0 24px 12px;
`;

export const SectionContent = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingHorizontal: 24,
  },
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})``;

export const Hour = styled(RectButton)<SelectedProps & AvailableProps>`
  padding: 12px;
  background-color: ${(props) => (props.selected ? "#ff9000" : "#3e3b47")};
  border-radius: 10px;
  margin-right: 8px;

  ${(props) => !props.available && "opacity: 0.3"}
`;

export const HourText = styled.Text<SelectedProps>`
  color: ${(props) => (props.selected ? "#232129" : "#f4ede8")};
  font-family: "RobotoSlab-Regular";
  font-size: 16px;
`;

export const CreateAppointmentButton = styled(RectButton)`
  height: 50px;
  background-color: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 24px 24px;
`;

export const CreateAppointmentButtonText = styled.Text`
  font-family: "RobotoSlab-Medium";
  font-size: 18px;
  color: #232129;
`;
