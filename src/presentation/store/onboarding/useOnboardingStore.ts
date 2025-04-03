import {create} from 'zustand';

type OnboardingState = {
  hasCompletedOnboarding: boolean | null;

  setHasCompletedOnboarding: (completed: boolean) => void;
};

export const useOnboardingStore = create<OnboardingState>()(set => ({
  hasCompletedOnboarding: null,

  setHasCompletedOnboarding: completed =>
    set({hasCompletedOnboarding: completed}),
}));
