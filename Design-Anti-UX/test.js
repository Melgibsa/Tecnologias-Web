document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('formCadastro');
    const avisoDiv = document.getElementById('aviso');

    const modalVideo = document.getElementById('modalVideo');
    const video = document.getElementById('hamood');
    const statusVideo = document.getElementById('statusVideo');

    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    const btnVerSenha = document.getElementById('btnVerSenha');
    const contadorDiv = document.getElementById('contadorTentativas');

    const senhaInput = document.getElementById('senha');
    
    if (senhaInput) {
        ['copy', 'cut', 'paste'].forEach(evento => {
            senhaInput.addEventListener(evento, e => e.preventDefault());
            confirmarSenhaInput?.addEventListener(evento, e => e.preventDefault());
        });
    }
    
    let tentativasRestantes = 3;
    let timeoutVisibilidade = null;
    let contadorTentativasLogin = 0;
    let botaoJaDisponibilizado = false;

    let videoAssistido = false;
    let dadosUsuario = null;

    console.log('Script DOMContentLoaded executado');
    console.log('form:', form);
    console.log('modalVideo:', modalVideo);
    console.log('video:', video);

    if (!form) {
        console.error('Formulário não encontrado!');
        return;
    }

    function revelarSenhaTemporariamente() {
        if (tentativasRestantes <= 0) {
            alert('Você já usou todas as tentativas para ver a senha!');
            return;
        }
        
        confirmarSenhaInput.type = 'text';
        btnVerSenha.disabled = true;
        
        tentativasRestantes--;
        if (contadorDiv) {
            contadorDiv.textContent = `Tentativas restantes: ${tentativasRestantes}`;
        }
        
        if (timeoutVisibilidade) {
            clearTimeout(timeoutVisibilidade);
        }
        
        timeoutVisibilidade = setTimeout(() => {
            confirmarSenhaInput.type = 'password';
            btnVerSenha.textContent = 'ver senha';
            btnVerSenha.disabled = false;
            
            if (tentativasRestantes === 0) {
                btnVerSenha.disabled = true;
                btnVerSenha.style.display = 'none';
                botaoJaDisponibilizado = false;
                if (contadorDiv) {
                    contadorDiv.textContent = '';
                }
            }
        }, 3000);
    }

    form.addEventListener('submit', function(evento) {
        evento.preventDefault();
        console.log('Formulário enviado');

        contadorTentativasLogin++;
        console.log(`Tentativa número: ${contadorTentativasLogin}`);
        
        if (contadorTentativasLogin % 3 === 0 && !botaoJaDisponibilizado) {
            console.log('Mostrando botão de visualizar senha');
            if (btnVerSenha) {
                btnVerSenha.style.display = 'block';
                tentativasRestantes = 3;
                if (contadorDiv) {
                    contadorDiv.textContent = `Tentativas restantes: ${tentativasRestantes}`;
                }
                btnVerSenha.disabled = false;
                botaoJaDisponibilizado = true;
            }
        }
        
        dadosUsuario = {
            username: document.getElementById('username').value,
            senha: document.getElementById('senha').value,
            confirmarSenha: document.getElementById('confirmarSenha').value
        };
        
        console.log('Dados:', dadosUsuario);
        
        videoAssistido = false;
        video.currentTime = 0;
        
        modalVideo.style.display = 'flex';
        console.log('Modal exibido');
        
        video.play().then(() => {
            console.log('Vídeo começou a reproduzir');
        });
        
        if (avisoDiv) {
            avisoDiv.innerHTML = '';
        }
    });

    if (btnVerSenha) {
        btnVerSenha.addEventListener('click', revelarSenhaTemporariamente);
    }

    video.addEventListener('ended', function() {
        console.log('Vídeo terminou!');
        videoAssistido = true;
        
        setTimeout(() => {
            processarCadastro();
        }, 1500);
    });

    function processarCadastro() {
        if (!videoAssistido) {
            console.log('Vídeo não assistido');
            return;
        }
        
        const username = dadosUsuario.username;
        const senha = dadosUsuario.senha;
        const confirmarSenha = dadosUsuario.confirmarSenha;
        
        const maiusculas = (senha.match(/[A-Z]/g) || []).length;
        const minusculas = (senha.match(/[a-z]/g) || []).length;
        const numeros = (senha.match(/[0-9]/g) || []).length;
        const caracteresInvalidos = /[^A-Za-z0-9!@#$%^&*]/.test(senha);  

        let erros = [];
        
        if (!username) {
            erros.push('Nome de usuário é obrigatório');    
        } else if (username.length < 10) {
            erros.push('Nome de usuário deve ter pelo menos 10 caracteres');
        }
        
        if (!senha) {
            erros.push('Senha é obrigatória');
        } else if(caracteresInvalidos) {
            erros.push('Senha contém caracteres inválidos');
        } else if (senha.length < 8) {
            erros.push('Senha deve ter pelo menos 8 caracteres');
        } else if (maiusculas < 2) {
            erros.push('Senha deve conter no mínimo 2 letras maiúsculas');
        } else if (minusculas < 2) {
            erros.push('Senha deve conter no mínimo 2 letras minúsculas');
        } else if (numeros < 2) {
            erros.push('Senha deve conter no mínimo 2 números');
        } else if (senha.replace(/[^!@#$%^&*]/g, '').length < 2) {
            erros.push('Senha deve conter no mínimo 2 caracteres especiais (!@#$%^&*)');
        }
        
        if (senha !== confirmarSenha) {
            erros.push('As senhas não coincidem');
        }
        
        if (erros.length > 0) {
            console.log('Erros:', erros);
            
            if (avisoDiv) {
                avisoDiv.innerHTML = erros.join('<br>');
                avisoDiv.style.color = 'red';
            }
            
            setTimeout(() => {
                fecharModal();
            }, 2000);
            
            return;
        }
        
        console.log('Cadastro válido! Redirecionando...');
        
        contadorTentativasLogin = 0;
        botaoJaDisponibilizado = false;
        if (btnVerSenha) {
            btnVerSenha.style.display = 'none';
            btnVerSenha.disabled = false;
            btnVerSenha.textContent = 'ver senha';
        }
        if (contadorDiv) {
            contadorDiv.textContent = '';
        }
        
        setTimeout(() => {
            fecharModal();
            window.location.replace('page_successful.html');
        }, 1500);
    }

    function fecharModal() {
        console.log('Fechando modal');
        modalVideo.style.display = 'none';
        video.pause();
        video.currentTime = 0;
        videoAssistido = false;
        
        botaoJaDisponibilizado = false;
    }
});