import {useCallback, useMemo, useRef} from "react";
import useEvent from "./useEvent";
import debounce from 'lodash/debounce'
import useCurrentUser from "./useCurrentUser";

export default function usePushNotification() {


  const {data: event} = useEvent()
  const {user} = useCurrentUser()
  const userIdSetted = useRef(false)

  let OneSignal: any = undefined;

  OneSignal = typeof window !== 'undefined' && window['OneSignal'] || undefined;

  const OneSignalSetup = useCallback(() => {

    if (typeof OneSignal === 'undefined'
      || typeof OneSignal.push !== 'function'
      || OneSignal.initialized) {
      return
    }
    console.log('usePushNotification CALLBACK', typeof OneSignal);

    // if (typeof window['OneSignal'] !== 'undefined') return;


    OneSignal.push(function () {
      OneSignal.init({
        appId: process.env.ONESIGNAL_ID,
        subdomainName: process.env.ONESIGNAL_SUBDOMAINNAME,
        autoResubscribe: true,
        promptOptions: {
          /* Change bold title, limited to 30 characters */
          siteName: event?.name || 'Notificações do evento',
          /* Subtitle, limited to 90 characters */
          actionMessage: 'Assine as notificações para saber quando houver alterações no status dos seus trabalhos.',
          /* Example notification title */
          exampleNotificationTitle: 'Trabalho atualizado',
          /* Example notification message */
          exampleNotificationMessage: 'O trabalho 123 foi revisado',
          /* Text below example notification, limited to 50 characters */
          exampleNotificationCaption: 'Você pode alterar isso a qualquer momento',
          /* Accept button text, limited to 15 characters */
          acceptButtonText: "OK, ASSINAR",
          /* Cancel button text, limited to 15 characters */
          cancelButtonText: 'Não',
          autoAcceptTitle: 'Clique SIM',
          // slidedown | native
          slidedown: {
            enabled: true,
            autoPrompt: true,
            timeDelay: 0,
            pageViews: 1
          }
        },
        welcomeNotification: {
          title: event?.name,
          message: "Obrigado por se inscrever!",
        },
        // bell icon
        notifyButton: {
          enable: true, /* Required to use the Subscription Bell */
          size: 'small', /* One of 'small', 'medium', or 'large' */
          theme: 'inverse', /* One of 'default' (red-white) or 'inverse" (white-red) */
          position: 'bottom-right', /* Either 'bottom-left' or 'bottom-right' */
          offset: {
            bottom: '10px',
            left: '0px', /* Only applied if bottom-left */
            right: '10px' /* Only applied if bottom-right */
          },
          showCredit: false, /* Hide the OneSignal logo */
          text: {
            'tip.state.unsubscribed': 'Assine as notificações',
            'tip.state.subscribed': "Você já está inscrito",
            'tip.state.blocked': "Você bloqueou as notificações",
            'message.prenotify': 'Clique para receber as notificações',
            'message.action.subscribed': "Obrigado por assinar!",
            'message.action.resubscribed': "Você está inscrito nas notificações",
            'message.action.unsubscribed': "Você não irá receber as notificações",
            'dialog.main.title': 'Gerenciar notificações',
            'dialog.main.button.subscribe': 'OK, ASSINAR',
            'dialog.main.button.unsubscribe': 'DESCADASTRAR',
            'dialog.blocked.title': 'Desbloqueie as notificações',
            'dialog.blocked.message': "Sigas estas instruções para ativar as notificações:"
          }
        },
      });
      OneSignal.showSlidedownPrompt();
      console.log(OneSignal?.initialized, user.getId());
      // OneSignal.showNativePrompt();
    });

    return OneSignal

  }, [OneSignal])

  useMemo(async () => {
    if (user && user.getId() > 0 && user.getUserData().onesignal_hash && !userIdSetted.current && OneSignal?.initialized) {
      OneSignal.push(function () {
        OneSignal.getExternalUserId().then(externalId => {
          console.log({externalId});
          if (!externalId) {
            setUserId(user.getId(), user.getUserData().onesignal_hash)
            OneSignal.sendTags({
              evaluator: user.isEvaluator() ? 'yes' : 'no',
              supervisor: user.isSupervisor() ? 'yes' : 'no',
              participant: user.isParticipant() ? 'yes' : 'no',
            }, function(tagsSent) {
              console.log('tags:!!! ', tagsSent);
            });
          }
        })
      });
      //
    }
  }, [user, OneSignal])

  function setUserId(id: number, hash: string) {
    console.log('setExternalUserId');
    userIdSetted.current = true
    OneSignal.push(function () {
      OneSignal.setExternalUserId(id, hash);
    });
  }

  function setTag(tagName: string, value: string) {
    console.log('setTag', tagName, value);
    OneSignal.push(function () {
      OneSignal.sendTag(tagName, value);
    });
  }

  function debugNotification() {
    OneSignal.sendSelfNotification(
      /* Title (defaults if unset) */
      "OneSignal Web Push Notification",
      /* Message (defaults if unset) */
      "Action buttons increase the ways your users can interact with your notification.",
      /* URL (defaults if unset) */
      'https://conceito-online.com.br/',
      /* Icon */
      'https://onesignal.com/images/notification_logo.png',
      {
        /* Additional data hash */
        notificationType: 'news-feature'
      },
      [{ /* Buttons */
        /* Choose any unique identifier for your button. The ID of the clicked button is passed to you so you can identify which button is clicked */
        id: 'like-button',
        /* The text the button should display. Supports emojis. */
        text: 'Like',
        /* A valid publicly reachable URL to an icon. Keep this small because it's downloaded on each notification display. */
        icon: 'http://i.imgur.com/N8SN8ZS.png',
        /* The URL to open when this action button is clicked. See the sections below for special URLs that prevent opening any window. */
        url: 'https://conceito-online.com.br/'
      }, {
        id: 'read-more-button',
        text: 'Read more',
        icon: 'http://i.imgur.com/MIxJp1L.png',
        url: 'https://conceito-online.com.br/'
      }]
    );
  }


  return {
    isInitialized: OneSignal?.initialized || false,
    InitPushNotification: OneSignalSetup,
    setUserId,
    debugNotification,
    setTag
  }

}
