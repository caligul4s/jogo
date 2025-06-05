const NAMES_MALE = ["Auron", "Rok", "Dante", "Leo", "Iker"];
const NAMES_FEMALE = ["Miry", "Lina", "Sora", "Talia", "Nira"];
const TRAITS = ["Paciente", "Impulsivo", "Gênio", "Desajeitado", "Resistente", "Preguiçoso", "Otimista", "Sociável"];

function getRandomGender() {
  return Math.random() < 0.5 ? "male" : "female";
}

function getRandomName(gender) {
  return gender === "male"
    ? NAMES_MALE[Math.floor(Math.random() * NAMES_MALE.length)]
    : NAMES_FEMALE[Math.floor(Math.random() * NAMES_FEMALE.length)];
}

export function generateColonistData() {
  const gender = getRandomGender();
  return {
    name: getRandomName(gender),
    age: 18 + Math.floor(Math.random() * 43),
    gender: gender,
    traits: TRAITS.sort(() => 0.5 - Math.random()).slice(0, 2),
    skills: {
      construction: Math.floor(Math.random() * 10) + 1,
      gathering: Math.floor(Math.random() * 10) + 1,
      cooking: Math.floor(Math.random() * 10) + 1
    },
    sprite: "colonist"
  };
}