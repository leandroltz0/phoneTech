import React from 'react';
import { Tabs } from 'expo-router';
import { CustomBottomNavBar } from '@/components/navigation/CustomBottomNavBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomBottomNavBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="proyectos"
        options={{
          title: 'Proyectos',
        }}
      />
      <Tabs.Screen
        name="crear-proyecto"
        options={{
          title: 'Nuevo Proyecto',
        }}
      />
      <Tabs.Screen
        name="ganancias"
        options={{
          title: 'Ganancias',
        }}
      />
    </Tabs>
  );
}
