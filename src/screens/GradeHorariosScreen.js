import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GradeHorariosScreen from '../src/screens/GradeHorariosScreen';

describe('GradeHorariosScreen', () => {
  it('renderiza corretamente os elementos principais', () => {
    const { getByText } = render(<GradeHorariosScreen />);

    // Verifica se o título está na tela
    expect(getByText('Grade de Horários')).toBeTruthy();

    // Verifica se ao menos um horário aparece (ajuste conforme os dados reais)
    expect(getByText(/08:00 - 08:45/i)).toBeTruthy();
  });

  it('expande os detalhes ao clicar em um horário', () => {
    const { getByText, queryByText } = render(<GradeHorariosScreen />);

    // Supondo que esse horário tem detalhes como "Aula de Português"
    const horario = getByText('08:00 - 08:45');
    
    // Detalhes devem estar ocultos inicialmente
    expect(queryByText(/Português/i)).toBeNull();

    // Clica para expandir
    fireEvent.press(horario);

    // Agora deve aparecer
    expect(queryByText(/Português/i)).toBeTruthy();
  });
});
