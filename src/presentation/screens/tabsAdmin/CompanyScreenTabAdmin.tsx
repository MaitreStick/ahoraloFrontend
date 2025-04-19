// src/presentation/screens/CompanyScreenTabAdmin.tsx
import React from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { CompanyAdminTopTabs } from '../../navigation/CompanyAdminTopTabs';

export const CompanyScreenTabAdmin = () => (
  <MainLayout
    title="Panel Administrativo"
    subTitle="Empresas y Almacenes"
    showBackAction={false}
  >
    <CompanyAdminTopTabs />
  </MainLayout>
);