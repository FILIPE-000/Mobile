# Publicação no GitHub

O pacote contém um repositório Git local com commits da implementação. Para publicar no seu GitHub:

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

Se você preferir criar o repositório pelo GitHub CLI:

```bash
gh repo create lista-facil --public --source=. --remote=origin --push
```

Não coloque tokens ou senhas no repositório.
