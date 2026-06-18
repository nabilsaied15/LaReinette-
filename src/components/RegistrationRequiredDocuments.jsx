import { Download, Mail, MapPin, FileText } from 'lucide-react';
import {
  REGISTRATION_DOCUMENTS_TITLE,
  REGISTRATION_DOCUMENTS_AGE_GROUP,
  REGISTRATION_DOCUMENTS_REQUIRED,
  REGISTRATION_DOCUMENTS_AGE_60_69_INTRO,
  REGISTRATION_DOCUMENTS_AGE_60_69,
} from '../data/registrationRequiredDocuments';

/**
 * Bloc pièces justificatives + consignes pour finaliser l'inscription.
 */
export default function RegistrationRequiredDocuments({
  contact,
  onDownloadPdf,
  isDownloading = false,
  showFinalizeInstructions = true,
  highlight = false,
}) {
  const addressLine = [contact?.address, contact?.city].filter(Boolean).join(', ');
  const email = contact?.formRecipientEmail || contact?.email || '';

  return (
    <section
      className={`registration-docs-panel${highlight ? ' registration-docs-panel--highlight' : ''}`}
      aria-labelledby="registration-docs-title"
    >
      <div className="registration-docs-panel__header">
        <FileText size={22} aria-hidden />
        <div>
          <h3 id="registration-docs-title" className="registration-docs-panel__title">
            {REGISTRATION_DOCUMENTS_TITLE}
          </h3>
          <p className="registration-docs-panel__subtitle">{REGISTRATION_DOCUMENTS_AGE_GROUP}</p>
        </div>
      </div>

      <div className="registration-docs-panel__lists">
        <ul className="registration-docs-list">
          {REGISTRATION_DOCUMENTS_REQUIRED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="registration-docs-panel__subblock">
          <p className="registration-docs-panel__subblock-title">
            + {REGISTRATION_DOCUMENTS_AGE_60_69_INTRO}
          </p>
          <ul className="registration-docs-list">
            {REGISTRATION_DOCUMENTS_AGE_60_69.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {onDownloadPdf && (
        <button
          type="button"
          className="registration-docs-download-btn"
          onClick={onDownloadPdf}
          disabled={isDownloading}
        >
          <Download size={18} aria-hidden />
          {isDownloading ? 'Téléchargement…' : 'Télécharger la liste des documents (PDF)'}
        </button>
      )}

      {showFinalizeInstructions && (
        <div className="registration-docs-finalize">
          <p className="registration-docs-finalize__lead">
            Pour <strong>finaliser votre inscription</strong>, vous pouvez :
          </p>
          <ul className="registration-docs-finalize__options">
            <li>
              <MapPin size={18} aria-hidden />
              <span>
                <strong>Ramener ces documents à l&apos;ASAD</strong>
                {addressLine ? (
                  <>
                    {' '}
                    — <address className="registration-docs-address">{addressLine}</address>
                  </>
                ) : null}
              </span>
            </li>
            <li>
              <Mail size={18} aria-hidden />
              <span>
                <strong>Si vous ne pouvez pas vous déplacer</strong>, les transmettre par e-mail à{' '}
                {email ? (
                  <a href={`mailto:${email}`} className="registration-docs-email">
                    {email}
                  </a>
                ) : (
                  "l'adresse indiquée par l'ASAD"
                )}
              </span>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
