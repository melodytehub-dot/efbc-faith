'use client';

import { useState } from 'react';
import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { church } from '../../lib/content';

const groups = [
  {
    title: 'Questions About Our Church',
    items: [
      { q: 'Do you have programs for children and youth?', a: 'Yes. Our Children and Youth ministries meet alongside the Sunday service with age-appropriate teaching, worship and activities. Ask a member of the welcome team and we will point your family to the right place.' },
      { q: 'What should I expect during a worship service?', a: 'Expect a warm welcome, congregational singing in Hakha Chin, prayer, scripture reading from the Baibal Thiang, and a sermon. Our services are reverent and family-friendly — come as you are.' },
      { q: 'What are your service times?', a: 'Our Sunday service runs from 2:00 PM to 4:00 PM. The church office is open Monday to Saturday, 9:00 AM to 5:00 PM.' },
      { q: 'How can I get involved in church activities?', a: 'There is a place for you in one of our six ministries — Worship, Children, Youth, Women, Mission or Building. Speak with a leader after the service and we will help you find where you fit.' },
      { q: 'Where is the church located?', a: 'We meet at 235 Knight Haven Circle, Star City, AR 71667.' },
    ],
  },
  {
    title: 'Questions About Our Sermons',
    items: [
      { q: 'Do you offer online or live-streamed services?', a: 'Yes. We share a live broadcast each Sunday. Open the Live screen on Sunday afternoon to watch, and you will find previous messages there too.' },
      { q: 'How can I become a member of the church?', a: 'We would love to welcome you. Worship with us a few times, then speak with the church leadership about membership and baptism. You can also write to efbcusainfo@gmail.com.' },
      { q: 'Are visitors welcome to attend services?', a: 'Absolutely. Whether you are seeking spiritual renewal, community or a deeper walk with Christ, you are welcome here. You will find open hearts and open arms.' },
    ],
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <section className="block block--flush">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <span className="eyebrow">Doubt and discovery</span>
          <h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)', maxWidth: '14ch' }}>Questions, answered.</h1>
          {groups.map((g) => (
            <div key={g.title} style={{ marginTop: 44 }}>
              <h2 style={{ fontSize: 26, marginBottom: 18 }}>{g.title}</h2>
              <div style={{ display: 'grid', gap: 10 }}>
                {g.items.map((item) => {
                  const id = `${g.title}-${item.q}`;
                  const isOpen = open === id;
                  return (
                    <div className="card" key={id} style={{ padding: 0, overflow: 'hidden' }}>
                      <button type="button" onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} style={{ width: '100%', background: 'transparent', border: 0, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, textAlign: 'left', fontWeight: 600 }}>
                        {item.q}
                        <Icon name="chevron" className={isOpen ? 'icon' : 'icon'} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 160ms ease', color: 'var(--p-accent)' }} />
                      </button>
                      {isOpen && <p style={{ padding: '0 24px 22px', color: 'var(--p-muted)' }}>{item.a}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="card" style={{ marginTop: 44 }}>
            <h3>Still have a question?</h3>
            <p style={{ marginTop: 8 }}>Write to us at <a href={`mailto:${church.emails[0]}`} style={{ color: 'var(--p-accent)' }}>{church.emails[0]}</a> or call {church.phones[0]}.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
