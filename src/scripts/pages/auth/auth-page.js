import { login, register } from '../../model.js';

export default class AuthPage {
  constructor(isRegister = false) {
    this.isRegister = isRegister;
  }

  async render() {
    return `
      <section class="container">
        <h1>${this.isRegister ? 'Daftar' : 'Masuk'}</h1>

        <form id="auth-form" aria-describedby="auth-desc">
          <p id="auth-desc" class="visually-hidden">
            Form untuk ${this.isRegister ? 'mendaftar akun baru' : 'masuk ke aplikasi'}.
          </p>

          <fieldset>
            <legend class="visually-hidden">
              ${this.isRegister ? 'Form pendaftaran' : 'Form login'}
            </legend>

            ${this.isRegister ? `
              <div class="form-group">
                <label for="name">Nama</label>
                <input type="text" id="name" name="name" required autocomplete="name"/>
              </div>
            ` : ''}

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required autocomplete="email"/>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                autocomplete="${this.isRegister ? 'new-password' : 'current-password'}"
              />
            </div>
          </fieldset>

          <button 
            type="submit" 
            aria-label="${this.isRegister ? 'Daftar akun' : 'Masuk ke akun'}"
            class="btn-submit"
          >
            ${this.isRegister ? 'Daftar' : 'Masuk'}
          </button>
        </form>

        <p>
          ${this.isRegister 
            ? 'Sudah punya akun? <a href="#/login">Masuk</a>' 
            : 'Belum punya akun? <a href="#/register">Daftar</a>'
          }
        </p>
      </section>
    `;
  }

  async afterRender() {
    document.getElementById('auth-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const name = this.isRegister ? document.getElementById('name').value : null;

      try {
        if (this.isRegister) {
          await register(name, email, password);
        } else {
          await login(email, password);
        }

        window.location.hash = '/';
      } catch (err) {
        alert(err.message);
      }
    });
  }
}
