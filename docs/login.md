# Login

## Login via rede social

    1 Se retornar com erro
        * exibe o erro
        * oferece o login com e-mail
    2 Logou com sucesso
        * verifica ID DA REDE
        * se já existir
            * verifica se existe outro usuário (ID social) com o mesmo email
                * exibe e-mail truncado e oferece opção do usuário mesclar as contas (salva mais um ID social)
                * se NÃO, não permite fazer login, faz logout do usuário
                * se SIM, salva mais um ID social na mesma conta
                * faz login
            * se não existir, faz login
        * não existe
            * verifica se existe usuário com o mesmo email
            * se existe
                * faz logout
                * exibe e-mail truncado e oferece opção do usuário mesclar as contas (salva o ID social) 
                    * se quiser mesclar envia e-mail com link para mesclar contas
                        * clica no e-mail, mescla, redireciona para login
                    * se não, pede para fazer login de outra forma
            * se NÃO existe
                * cria usuário com senha aleatória
                * exibe o e-mail para que usuário saiba qual o e-mail dele. 
                    oferece opção de mudar o e-mail de cadastro.
                    mensagem para alertar a fazer login com a mesma rede social.
                * envia e-mail informando que se quiser pode fazer o login com e-mail e senha.
                    para isso tem que fazer processo de recuperação de senha