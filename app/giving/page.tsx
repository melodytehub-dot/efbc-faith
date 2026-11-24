import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { church } from '../../lib/content';

const funds = [
  { name: 'Medical', note: 'Helping members and families with medical needs.' },
  { name: 'Education', note: 'Supporting children and youth in their studies.' },
  { name: 'Meals', note: 'Providing meals for families in our community.' },
];

export default function GivingPage() {
  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <span className="eyebrow">Giving</span>
          <h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)', maxWidth: '14ch' }}>Give cheerfully. Serve faithfully.</h1>
          <p className="lead" style={{ marginTop: 18 }}>Your gift supports the ministry of EFBC and helps us care for families in Star City and the wider Chin community.</p>
          <div className="grid grid--3" style={{ marginTop: 40 }}>
            {funds.map((f) => (
              <div className="card" key={f.name}>
                <div className="card__icon"><Icon name="gift" /></div>
                <h3>{f.name}</h3>
                <p>{f.note}</p>
              </div>
            ))}
          </div>
          <div className="card" style={{ marginTop: 24, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div>
              <h3>Give through the church office</h3>
              <p style={{ marginTop: 6 }}>Giving is processed securely on the church's existing donation page.</p>
            </div>
            <a className="btn btn--primary" href="https://efbcusa.com/donation/" target="_blank" rel="noreferrer">Open donation page <Icon name="arrow" /></a>
          </div>
          <p style={{ marginTop: 24, color: 'var(--p-muted)' }}>Questions about giving? Write to {church.emails[0]} or call {church.phones[0]}.</p>
        </div>
      </section>
      <Footer />
    </>
  );
}
