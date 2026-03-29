
import styles from "./firstpage.module.css";

export function FirstPage() {
    return (
        <div className={styles.container}>
              <section className={styles.upAndDownText}>
                <h2 className={styles.title}>
                    Monitorizează-ți cheltuielile ușor și eficient
                </h2>
                <p className={styles.subtitle}>
                    Ține-ți finanțele sub control, creează bugete și vezi unde se duc banii tăi, toate într-o singură aplicație modernă.
                </p>
              
            </section>

            <section className={styles.sectionCards}>
                <h3 className={styles.sectionTitle}>Funcționalități</h3>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h4>📊 Monitorizare în timp real</h4>
                        <p>Adaugă cheltuieli și urmărește-le instant.</p>
                    </div>
                    <div className={styles.card}>
                        <h4>💰 Bugete personalizate</h4>
                        <p>Setează limite pentru fiecare categorie de cheltuieli.</p>
                    </div>
                    <div className={styles.card}>
                        <h4>📈 Rapoarte detaliate</h4>
                        <p>Analizează-ți obiceiurile financiare cu grafice clare.</p>
                    </div>
                </div>
            </section>

                  <section className={styles.upAndDownText}>
                <h3>Preia controlul asupra banilor tăi</h3>
                <p>Începe chiar azi și vezi diferența.</p>
                
            </section>

            
        </div>
    );
};

;
