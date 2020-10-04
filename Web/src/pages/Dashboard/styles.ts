import styled from "styled-components";
import { lighten, shade } from "polished";

export const Container = styled.div``;

export const Header = styled.header`
  padding: 14px 0;
  background-color: #28262e;
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    height: 74px;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    margin-left: auto;
    background: transparent;
    border: 0;
    border-radius: 10px;
    transition: background-color 0.2s;

    :hover {
      background-color: ${lighten(0.05, "#28262e")};
    }

    svg {
      color: #999591;
      width: 20px;
      height: 20px;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;

  a {
    text-decoration: none;
    transition: opacity 0.2s;

    :hover {
      opacity: 0.8;
    }
  }

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;

    span {
      color: #f4ede8;
    }

    strong {
      color: #ff9000;
    }
  }
`;

export const Content = styled.main`
  max-width: 1120px;
  margin: 40px auto;
  display: flex;
`;

export const Schedule = styled.div`
  flex: 1;
  margin-right: 120px;

  h1 {
    font-size: 32px;
  }

  p {
    margin-top: 8px;
    color: #ff9000;
    display: flex;
    align-items: center;
    font-weight: 500;

    span {
      display: flex;
      align-items: center;
    }

    span + span::before {
      content: "";
      width: 1.5px;
      height: 14px;
      background-color: #ff9000;
      margin: 0 8px;
    }
  }
`;

export const NextAppointment = styled.div`
  margin-top: 34px;

  > strong {
    color: #999591;
    font-size: 22px;
  }

  div {
    display: flex;
    align-items: center;
    background-color: #3e3b47;
    padding: 12px 20px;
    border-radius: 10px;
    margin-top: 24px;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      height: 80%;
      width: 2px;
      left: 1px;
      top: 10%;
      background-color: #ff9000;
    }

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    strong {
      margin-left: 24px;
      color: #fff;
      font-size: 18px;
    }

    span {
      margin-left: auto;
      display: flex;
      align-items: center;
      color: #999591;

      svg {
        color: #ff9000;
        margin-right: 8px;
      }
    }
  }
`;

export const Section = styled.section`
  margin-top: 42px;

  > strong {
    color: #999591;
    font-size: 18px;
    line-height: 26px;
    border-bottom: 1px solid #3e3b47;
    display: block;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }

  > p {
    color: rgba(153, 149, 145, 0.6);
  }
`;

export const Appointment = styled.div`
  display: flex;
  align-items: center;

  & + div {
    margin-top: 16px;
  }

  span {
    margin-left: auto;
    display: flex;
    align-items: center;
    color: #f4ede8;
    width: 70px;

    svg {
      color: #ff9000;
      margin-right: 8px;
    }
  }

  div {
    display: flex;
    flex: 1;
    align-items: center;
    background-color: #3e3b47;
    padding: 10px 18px;
    border-radius: 10px;
    margin-left: 24px;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    strong {
      margin-left: 24px;
      color: #fff;
    }
  }
`;

export const Calendar = styled.aside`
  width: 440px;

  .DayPicker {
    background: #28262e;
    border-radius: 10px;
  }
  .DayPicker-wrapper {
    padding-bottom: 0;
  }
  .DayPicker,
  .DayPicker-Month {
    width: 351px;
  }
  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px;
  }
  .DayPicker-Day {
    width: 40px;
    height: 40px;
    transition: background-color 0.2s;
  }
  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: #3e3b47;
    border-radius: 10px;
    color: #fff;
  }
  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, "#3e3b47")};
  }
  .DayPicker-Day--today {
    font-weight: normal;
  }
  .DayPicker-Day--disabled {
    color: #666360 !important;
    background: transparent !important;
  }
  .DayPicker-Day--selected {
    background: #ff9000 !important;
    border-radius: 10px;
    color: #232129 !important;
  }

  .DayPicker-Caption {
    margin-left: 10px;
  }

  .DayPicker-Day--holiday {
    color: rgba(255, 0, 0, 0.6) !important;
  }
`;
