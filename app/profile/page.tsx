import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { church } from '../../lib/content';

export default function ProfilePage() {
  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Your space</span>
              <h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)' }}>Profile.</h1>
              <p className="lead" style={{ marginTop: 14 }}>Keep the things you use most close at hand.</p>
            </div>
          </div>

          <div className="grid grid--2">
            <div className="card">
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div className="avatar" style={{ width: 56, height: 56, fontSize: 18 }}>EF</div>
                <div><h3>EFBC member</h3><p>Walking in faith together</p></div>
              </div>
              <p style={{ marginTop: 22 }}>Church accounts and giving are managed through the church office. Contact us to update your details.</p>
              <a className="btn btn--ghost btn--sm" style={{ marginTop: 18 }} href={`mailto:${church.emails[0]}`}>Contact the office <Icon name="arrow" /></a>
            </div>
            <div className="card">
              <span className="eyebrow">Shortcuts</span>
              <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
                <a className="list-row" href="/bible/"><Icon name="bible" /><div className="list-row__title">Baibal Thiang</div><Icon name="chevron" className="icon list-row__arrow" /></a>
                <a className="list-row" href="/hymns/"><Icon name="music" /><div className="list-row__title">Khrihfa Hlabu</div><Icon name="chevron" className="icon list-row__arrow" /></a>
                <a className="list-row" href="/prayer/"><Icon name="prayer" /><div className="list-row__title">Send a prayer request</div><Icon name="chevron" className="icon list-row__arrow" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
