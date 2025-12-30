import { html, css, LitElement } from 'lit'

export interface LwSearchProps {
  label?: string
  placeholder?: string
}

export class LwSearch extends LitElement {
  static properties = {
    label: { type: String },
    placeholder: { type: String },
  }

  label = ''
  placeholder = ''

  render() {
    return html`
      <form method="get" action="https://daten.lobbywatch.ch/de/search">
        <input type="text" name="term" placeholder=${this.placeholder} />
        <div class="separator" aria-hidden="true" role="presentation"></div>
        <button><span>${this.label}</span></button>
      </form>
    `
  }

  static styles = css`
    form {
      display: flex;
      gap: 1rem;
      background: white;
      border-radius: 2rem;
      width: 100%;
      max-width: 40rem;
      padding-block: 0.5rem;
      padding-inline: 0.5rem;
    }

    input[type='text'] {
      border: none;
      width: 100%;
      border-radius: 2.5rem;
      padding-inline: 1rem;
    }

    .separator {
      width: 1px;
      background: #cbcbcb;
    }

    button {
      color: white;
      background: #ff4547;
      background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20640%22%3E%3C!--!Font%20Awesome%20Free%20v7.1.0%20by%20%40fontawesome%20-%20https%3A%2F%2Ffontawesome.com%20License%20-%20https%3A%2F%2Ffontawesome.com%2Flicense%2Ffree%20Copyright%202025%20Fonticons%2C%20Inc.--%3E%3Cpath%20fill%3D%22white%22%20d%3D%22M480%20272C480%20317.9%20465.1%20360.3%20440%20394.7L566.6%20521.4C579.1%20533.9%20579.1%20554.2%20566.6%20566.7C554.1%20579.2%20533.8%20579.2%20521.3%20566.7L394.7%20440C360.3%20465.1%20317.9%20480%20272%20480C157.1%20480%2064%20386.9%2064%20272C64%20157.1%20157.1%2064%20272%2064C386.9%2064%20480%20157.1%20480%20272zM272%20416C351.5%20416%20416%20351.5%20416%20272C416%20192.5%20351.5%20128%20272%20128C192.5%20128%20128%20192.5%20128%20272C128%20351.5%20192.5%20416%20272%20416z%22%2F%3E%3C%2Fsvg%3E');
      background-size: 50%;
      background-repeat: no-repeat;
      background-position: center;
      border: none;
      border-radius: 2.5rem;
      height: 2.5rem;
      min-width: 2.5rem;
      width: 2.5rem;

      & span {
        visibility: hidden;
      }
    }
  `
}
