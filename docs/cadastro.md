# Cadastro

TODO Implementar link de cadastro com perfil e categoria pré-definidos

## Via email
    * entra com e-mail e senha
    * verifica se e-mail existe
        * email NÃO existe
            * registra usuário com perfil mínimo. talvez tabela temporária
            * Adicionar metadata _profile_completed = 0
            * envia link de validação
            * exibe instruções ao usuário e o tempo máximo para validar o cadastro
            * ao clicar, usuário é redirecionado para cadastro fase 1
        * email existe
            * informa que o email já existe
                Exibe e-mail truncado e pegunta...
                Você reconhece este e-mail como seu? 
                Se sim, faça a recuperação da senha
                Se não, entre com outro e-mail para o cadastro
                
## Via rede social
    * login bem sucedido
    * redireciona para fase 1
        
## Cadastro fase 1
    Perunta: Mora no Brasil?
    Seletor de país de residência
    Obtem: Nome, sobrenome, e-mail (confirma), telefone, CPF/passaporte
    Após salvar, informa que o e-mail será usado como login, 
        ou via rede social desde que tenham o mesmo e-mail de cadastro
    OK, vai para cadastro completo
    
## Cadastro fase 2
    Form completo de cadastro
    Adicionar metadata _profile_completed = 1