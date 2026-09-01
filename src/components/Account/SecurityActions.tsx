import { useContext, useState } from 'react';
import { AuthContext } from '@/context/Auth/authContext';
import { changePassword, requestEmailChange } from '@/api/accountAPI';

export default function SecurityActions(): JSX.Element {
  const { token } = useContext(AuthContext);

  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMfaCode, setPwMfaCode] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [pwSubmitting, setPwSubmitting] = useState(false);

  // Update email
  const [newEmail, setNewEmail] = useState('');
  const [emailMfaCode, setEmailMfaCode] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  const cleanCode = (v: string) => v.replace(/\s/g, '');

  const formatCode = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 6);
    return digitsOnly.length > 3 ? `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}` : digitsOnly;
  };

  const doChangePassword = async () => {
    if (!token) return;
    setPwMsg('');
    setPwErr('');
    setPwSubmitting(true);
    try {
      await changePassword(token, currentPassword, newPassword, cleanCode(pwMfaCode) || undefined);
      setPwMsg('Password updated.');
      setCurrentPassword('');
      setNewPassword('');
      setPwMfaCode('');
    } catch (e) {
      setPwErr(e instanceof Error ? e.message : 'Failed to change password');
    } finally {
      setPwSubmitting(false);
    }
  };

  const doUpdateEmail = async () => {
    if (!token) return;
    setEmailMsg('');
    setEmailErr('');
    setEmailSubmitting(true);
    try {
      await requestEmailChange(token, newEmail.toLowerCase(), {
        mfaCode: cleanCode(emailMfaCode) || undefined,
      });
      setEmailMsg('Check your new email to confirm the change.');
      setNewEmail('');
      setEmailMfaCode('');
    } catch (e) {
      setEmailErr(e instanceof Error ? e.message : 'Failed to request email change');
    } finally {
      setEmailSubmitting(false);
    }
  };

  return (
    <div
      className="card"
    >
      <h2>Security Actions</h2>

      <hr className="sectionDivider"></hr>

      <div style={{ marginTop: '.5rem' }}>
        <h3>Change Password</h3>
        <hr className="sectionDivider"></hr>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={pwSubmitting}
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={pwSubmitting}
          style={{ marginTop: '.5rem' }}
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{3} ?\d{0,3}"
          placeholder="6-digit MFA code"
          value={pwMfaCode}
          onChange={(e) => setPwMfaCode(formatCode(e.target.value))}
          maxLength={7}
          disabled={pwSubmitting}
          style={{ marginTop: '.5rem' }}
        />
        <div style={{ marginTop: '.5rem' }}>
          <button
            onClick={doChangePassword}
            disabled={pwSubmitting}
          >
            {pwSubmitting ? 'Updating…' : 'Change Password'}
          </button>

          <hr className="sectionDivider"></hr>
        </div>
        {pwErr && <div className="authError">{pwErr}</div>}
        {pwMsg && <div className="authSuccess">{pwMsg}</div>}
      </div>

      <div>
        <h3>Update Email</h3>
        <hr className="sectionDivider"></hr>
        <input
          type="email"
          placeholder="New email"
          value={newEmail}
          style={{ textTransform: 'lowercase' }}
          onChange={(e) => setNewEmail(e.target.value)}
          disabled={emailSubmitting}
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{3} ?\d{0,3}"
          placeholder="6-digit MFA code"
          value={emailMfaCode}
          onChange={(e) => setEmailMfaCode(formatCode(e.target.value))}
          maxLength={7}
          disabled={emailSubmitting}
          style={{ marginTop: '.5rem' }}
        />
        <div style={{ marginTop: '.5rem' }}>
          <button
            onClick={doUpdateEmail}
            disabled={emailSubmitting}
          >
            {emailSubmitting ? 'Sending…' : 'Update Email'}
          </button>
        </div>
        {emailErr && <div className="authError">{emailErr}</div>}
        {emailMsg && <div className="authSuccess">{emailMsg}</div>}
      </div>
    </div>
  );
}