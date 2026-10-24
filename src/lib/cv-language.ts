import type { CVData } from './cv';
export const cvLabels = {
 pt:{profile:'Perfil profissional',work:'Experiência profissional',study:'Formação académica',skills:'Competências',languages:'Línguas',name:'O teu nome',empty:'O teu percurso vai aparecer aqui. Começa pelo perfil, experiência ou formação.'},
 en:{profile:'Professional profile',work:'Work experience',study:'Education',skills:'Skills',languages:'Languages',name:'Your name',empty:'Your journey will appear here. Start with your profile, experience or education.'},
};
export function labelsForCV(data:Pick<CVData,'cvLanguage'>){return cvLabels[data.cvLanguage==='en'?'en':'pt'];}
