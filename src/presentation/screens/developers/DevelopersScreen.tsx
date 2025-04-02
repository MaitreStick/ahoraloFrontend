/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {MainLayout} from '../../layouts/MainLayout';
import {developers} from '../../helpers/developersData';
import {DeveloperCard} from '../../components/developer/DeveloperCard';

export const DevelopersScreen = () => {
  return (
    <MainLayout title="Desarrolladores" subTitle="Equipo de Desarrollo">
      {developers.map(dev => (
        <DeveloperCard key={dev.id} developer={dev} />
      ))}
    </MainLayout>
  );
};
