'use client';
import Link from 'next/link';
import type {ReactNode} from 'react';
import {trackConversion} from '@/lib/seo-analytics';

export default function GuideEditorLink({href,className,children}:{href:string;className?:string;children:ReactNode}){
 return <Link href={href} className={className} onClick={()=>trackConversion('guide_editor_clicked')}>{children}</Link>;
}
