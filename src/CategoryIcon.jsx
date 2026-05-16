export default function CategoryIcon({ category }) {
  const cat = (category || "").toLowerCase();
  
  if (cat.includes("procesor")) {
    return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2H9V4H11V2H13V4H15V2H17V4H19C20.1 4 21 4.9 21 6V8H23V10H21V12H23V14H21V16H23V18H21C21 19.1 20.1 20 19 20H17V22H15V20H13V22H11V20H9V22H7V20H5C3.9 20 3 19.1 3 18V16H1V14H3V12H1V10H3V8H1V6H3C3 4.9 3.9 4 5 4H7V2M5 6V18H19V6H5M7 8H17V16H7V8M9 10H15V14H9V10Z" /></svg>;
  }
  if (cat.includes("grafická") || cat.includes("gpu")) {
    return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 5H22V17H2V5M4 7V15H20V7H4M6 9H10V13H6V9M14 9H18V13H14V9M8 10C8.55 10 9 10.45 9 11C9 11.55 8.55 12 8 12C7.45 12 7 11.55 7 11C7 10.45 7.45 10 8 10M16 10C16.55 10 17 10.45 17 11C17 11.55 16.55 12 16 12C15.45 12 15 11.55 15 11C15 10.45 15.45 10 16 10Z" /></svg>;
  }
  if (cat.includes("ram") || cat.includes("paměť")) {
    return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 7H22V17H2V7M4 9V15H6V11H8V15H10V11H12V15H14V11H16V15H18V9H4Z" /></svg>;
  }
  if (cat.includes("ssd") || cat.includes("hdd") || cat.includes("disk")) {
    return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C7.58 3 4 4.79 4 7V17C4 19.21 7.58 21 12 21C16.42 21 20 19.21 20 17V7C20 4.79 16.42 3 12 3M12 5C15.87 5 18 6.5 18 7C18 7.5 15.87 9 12 9C8.13 9 6 7.5 6 7C6 6.5 8.13 5 12 5M12 19C8.13 19 6 17.5 6 17V15.17C7.61 16.29 9.69 17 12 17C14.31 17 16.39 16.29 18 15.17V17C18 17.5 15.87 19 12 19M12 15C8.13 15 6 13.5 6 13V11.17C7.61 12.29 9.69 13 12 13C14.31 13 16.39 12.29 18 11.17V13C18 13.5 15.87 15 12 15Z" /></svg>;
  }
  if (cat.includes("deska")) {
    return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 2H20C21.1 2 22 2.9 22 4V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V4C2 2.9 2.9 2 4 2M4 4V20H20V4H4M6 6H12V12H6V6M14 6H18V8H14V6M14 10H18V12H14V10M6 14H18V16H6V14M6 18H18V20H6V18M8 8V10H10V8H8Z" /></svg>;
  }
  if (cat.includes("zdroj")) {
    return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4M4 6V18H20V6H4M7 8H9V10H7V8M11 8H13V10H11V8M15 8H17V10H15V8M12 12C14.21 12 16 13.79 16 16H8C8 13.79 9.79 12 12 12M12 13.5C10.62 13.5 9.5 14.62 9.5 16H14.5C14.5 14.62 13.38 13.5 12 13.5Z" /></svg>;
  }
  if (cat.includes("skříň")) {
    return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2H17C18.1 2 19 2.9 19 4V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V4C5 2.9 5.9 2 7 2M7 4V20H17V4H7M9 6H15V8H9V6M9 10H15V18H9V10Z" /></svg>;
  }
  if (cat.includes("chlazen")) {
    return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4M12 10.5C12.83 10.5 13.5 11.17 13.5 12C13.5 12.83 12.83 13.5 12 13.5C11.17 13.5 10.5 12.83 10.5 12C10.5 11.17 11.17 10.5 12 10.5M7 11.5L9.5 9L11.5 10.5L9.5 12.5L7 11.5M17 12.5L14.5 15L12.5 13.5L14.5 11.5L17 12.5M11.5 7L12.5 9.5L10.5 11.5L9 9.5L11.5 7M12.5 17L11.5 14.5L13.5 12.5L15 14.5L12.5 17Z" /></svg>;
  }
  
  // Výchozí obrázek, pokud kategorie není v seznamu
  return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>;
}
