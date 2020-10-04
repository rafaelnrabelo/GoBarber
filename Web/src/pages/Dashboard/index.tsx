import React, { useCallback, useState, useEffect, useMemo } from "react";
import { FiClock, FiPower } from "react-icons/fi";
import DayPicker, { DayModifiers } from "react-day-picker";
import axios from "axios";
import { isToday, format, getDay, parseISO, isAfter, addDays } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import "react-day-picker/lib/style.css";
import { Link } from "react-router-dom";

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Appointment,
  Section,
  Calendar,
} from "./styles";

import { useAuth } from "../../hooks/Auth";

import LogoImg from "../../assets/logo.svg";
import api from "../../services/api";

interface Appointment {
  id: string;
  date: string;
  hourFomatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  const [selectedDate, setSelectedDate] = useState(() => {
    let todayDate = new Date();

    if (getDay(todayDate) === 0) {
      todayDate = addDays(todayDate, 1);
    } else if (getDay(todayDate) === 6) {
      todayDate = addDays(todayDate, 2);
    }

    return todayDate;
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [holidays, setHolidays] = useState<Date[]>([]);
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => monthDay.available === false)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    const weekDays = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    return weekDays[getDay(selectedDate)];
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => parseISO(appointment.date).getHours() < 12
    );
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => parseISO(appointment.date).getHours() >= 12
    );
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find((appointment) =>
      isAfter(parseISO(appointment.date), new Date())
    );
  }, [appointments]);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user]);

  useEffect(() => {
    api
      .get<Appointment[]>(`/appointments/me`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => {
        const appointmentFormatted = response.data.map((appointment) => {
          return {
            ...appointment,
            hourFomatted: format(parseISO(appointment.date), "HH:mm"),
          };
        });
        setAppointments(appointmentFormatted);
      });
  }, [selectedDate, user]);

  const getHolidays = useCallback(async (year: number) => {
    const newHolidays = await axios.get(
      `https://api.calendario.com.br/?json=true&ano=${year}&token=cmFmYWVsbnJhYmVsb0BnbWFpbC5jb20maGFzaD0yNDc3MDk1NjM`
    );

    const filteredHolidays: Date[] = [];

    newHolidays.data.forEach((holiday: any) => {
      if (holiday.type === "Feriado Nacional") {
        const formattedDate = holiday.date.split("/");
        const date = new Date(
          formattedDate[2],
          formattedDate[1] - 1,
          formattedDate[0]
        );
        filteredHolidays.push(date);
      }
    });

    setHolidays(filteredHolidays);
  }, []);

  useEffect(() => {
    getHolidays(new Date().getFullYear());
  }, [getHolidays]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback(
    (date: Date) => {
      const currentMonthNumber = currentMonth.getMonth() + 1;
      const newMonthNumber = date.getMonth() + 1;

      if (
        (currentMonthNumber === 12 && newMonthNumber === 1) ||
        (currentMonthNumber === 1 && newMonthNumber === 12)
      ) {
        getHolidays(date.getFullYear());
      }

      setCurrentMonth(date);
    },
    [currentMonth, getHolidays]
  );

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={LogoImg} alt="GoBarber" />

          <Profile>
            <Link to="/profile">
              <img src={user.avatar_url} alt={user.name} />
            </Link>
            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>
          <button onClick={signOut} type="button">
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>
          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFomatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento nesse período</p>
            )}
            {morningAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFomatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento nesse período</p>
            )}
            {afternoonAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFomatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={["D", "S", "T", "Q", "Q", "S", "S"]}
            fromMonth={new Date()}
            disabledDays={[
              { daysOfWeek: [0, 6] },
              ...holidays,
              ...disabledDays,
            ]}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
              holiday: [...holidays],
            }}
            months={[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
