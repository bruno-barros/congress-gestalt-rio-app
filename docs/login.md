# Login

## Login via rede social

    1 Se retornar com erro
        OK exibe o erro
        OK oferece o login com e-mail
    2 Logou com sucesso
        * verifica ID DA REDE
        * se já existir ID
            * verifica o status de cadastro (_profile_completed)
                * se for '0' > redireciona para fase 1
                * se for '1' > login/dashboard             
        * não existe ID social (nunca logou via rede social)
            * verifica se existe usuário com o mesmo email
            * se existe
                * não faz login
                * exibe e-mail e oferece opção do usuário mesclar as contas (salva o ID social) 
                    * se quiser mesclar envia e-mail com link para mesclar contas
                        * clica no e-mail, mescla, redireciona para login
                    * se não, pede para fazer login de outra forma
            * se NÃO existe
                * cria usuário com senha igual ao e-mail
                    e retorna 'authToken' e 'refreshToken'
                ? adiciona metadata _revalidate_password = 1
                * Adicionar metadata _profile_completed = 0
                * exibe o e-mail para que usuário saiba qual o e-mail dele. 
                    oferece opção de mudar o e-mail de cadastro.
                    mensagem para alertar a fazer login com a mesma rede social.
                    redireciona para cadastro fase 1
                * envia e-mail informando que se quiser pode fazer o login com e-mail e senha.
                    para isso tem que fazer processo de recuperação de senha