function ContactIcon({ name }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "copy" && <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M15 4H6a2 2 0 0 0-2 2v9" /></>}
      {name === "check" && <path d="m5 12 4 4L19 6" />}
      {name === "up" && <path d="M12 20V4m-6 6 6-6 6 6" />}
    </svg>
  );
}

export default ContactIcon;
