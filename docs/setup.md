# Setup

Passo a passo para personalização.

## App
    * _document allow OneSignal
        * setup tags on usePushNotification()
    * Set GA_ID (Google Analytics)
    * /public/favicon.ico
    * /public/img/logo-*.png
    * Ocultar campos indesejados
    * Padrão de cores Bootstrap
    
## Back-end
    ### WP
        * Configurar os perfis
            * Para todos: 
                list_users
                edit_posts
                edit_others_posts
                create_posts
                delete_posts
                edit_published_posts
                publish_posts
            * Para Editor: edit_others_shop_orders, edit_shop_orders
    ### \Evento
    * Evento/config/*
        * Definir statuses
        * Definir campos obrigatórios
        * Quantidade de caracteres, autores e anexos
        * Página com regras de submissão
        * /components/abstracts/abstracts-rules.tsx
        * Página com termos de uso
        * Configurar OneSignal
    ### Theme
    * /theme/views/emails/*
        * welcome e-mail
    * /theme/header-checkout.php
    * /theme/assets/img/*
