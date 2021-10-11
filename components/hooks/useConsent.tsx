import { useState } from 'react';
import { useQuery, useQueryClient, QueryClient } from 'react-query';
import useCurrentUser from "./useCurrentUser";

interface ConsentData {
  visible: boolean
  dirty: boolean
}

interface UserConsent extends ConsentData {
  show: () => void;
  hide: () => void;
}

export default function useConsent(): UserConsent {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<ConsentData, null>(["user-consent"], queryConsent, {
    staleTime: Infinity,
    initialData: {
      visible: false,
      dirty: false,
    }
  });

  function queryConsent() {
    // const data = queryClient.getQueryData("user-consent");
    return {
      visible: false,
      dirty: false,
    };
  }

  function show() {
    // const data: ConsentData = queryClient.getQueryData("user-consent");
    queryClient.setQueryData(["user-consent"], { ...data, visible: true, dirty: true });
  }

  function hide() {
    // const data: ConsentData = queryClient.getQueryData("user-consent");
    queryClient.setQueryData(["user-consent"], { ...data, visible: false });
  }

  return {
    visible: data.visible || false,
    dirty: data.dirty || false,
    show,
    hide
  };
}
