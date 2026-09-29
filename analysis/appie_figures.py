"""Reproduce with: python analysis/appie_figures.py /path/to/laatste_kans_trends.csv
Source: Wobknaap/Appie-App commit 39b65f83db54ff937c0d43aed3a48950eca76e7e.
Each CSV row is an observed offer, not a sale. Deduplicate titles per snapshot.
"""
from pathlib import Path
import sys,json
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.ticker import MaxNLocator
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/images/appie';OUT.mkdir(parents=True,exist_ok=True)
x=pd.read_csv(sys.argv[1]);x['t']=pd.to_datetime(x.fetch_timestamp);x['day']=x.t.dt.normalize()
days=pd.date_range(x.day.min(),x.day.max());snap=x.groupby('t').title.nunique();daily=snap.groupby(snap.index.normalize()).agg(['median','min','max','count']).reindex(days)
PAPER='#f0eee2';INK='#17241b';GREEN='#264534';ORANGE='#c65c3c';MOSS='#667963';GRID='#d6d8cb'
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':11,'text.color':INK,'axes.labelcolor':INK,'xtick.color':MOSS,'ytick.color':MOSS,'axes.facecolor':PAPER,'figure.facecolor':PAPER,'axes.spines.top':False,'axes.spines.right':False,'axes.spines.left':False,'axes.spines.bottom':False,'svg.fonttype':'none'})
cmap=LinearSegmentedColormap.from_list('forest',['#e7e7d9','#b6c6a6','#65896b',GREEN])
def base(num,title,subtitle,height=6.5):
 fig=plt.figure(figsize=(14,height));fig.text(.06,.95,f'APPIE SNIPER  /  {num}',fontsize=10,color=ORANGE,weight='bold');fig.text(.06,.887,title,fontsize=25,weight='bold');fig.text(.06,.835,subtitle,fontsize=11,color=MOSS);return fig
def foot(fig,note):
 fig.text(.06,.045,note,fontsize=9,color=MOSS,linespacing=1.5)
def save(fig,name):
 fig.savefig(OUT/(name+'.svg'),facecolor=PAPER);fig.savefig(OUT/(name+'.png'),dpi=160,facecolor=PAPER);plt.close(fig)
fig=base('01','Het aanbod verandert van dag tot dag','Unieke productnamen per meetmoment · AH Woenselse Markt · februari 2026')
ax=fig.add_axes([.075,.23,.87,.53]);ix=np.arange(len(days))
ax.vlines(ix,daily['min'],daily['max'],color='#adbda3',lw=8,alpha=.65,label='Minimum tot maximum per dag')
ax.plot(ix,daily['median'],color=GREEN,lw=2,marker='o',ms=5,label='Mediaan per dag')
ax.set_ylim(0,370);ax.set_ylabel('Productnamen');ax.grid(axis='y',color=GRID,lw=.6);ax.set_axisbelow(True)
ax.set_xticks(ix);ax.set_xticklabels([d.strftime('%d') for d in days]);ax.set_xlabel('Dag in februari');ax.legend(frameon=False,loc='upper left',fontsize=10,ncol=2)
for i,c in enumerate(daily['count']):ax.text(i,-.21,str(int(c)),transform=ax.get_xaxis_transform(),ha='center',fontsize=8,color=MOSS)
fig.text(.075,.082,'Meetmomenten per dag ↑',fontsize=9,color=MOSS)
foot(fig,'315 meetmomenten; per meetmoment telt een productnaam één keer. De meetfrequentie verschilt per dag.\n4 en 25 februari zijn gedeeltelijke dagen. Spreiding betreft waargenomen aanbod, geen verkoopaantallen.')
save(fig,'aanbod-door-de-tijd')
# Average category count over ALL snapshots that day, including zero for absent categories.
cat=x.dropna(subset=['categoryTitle']).groupby(['t','categoryTitle']).title.nunique().unstack(fill_value=0).reindex(snap.index,fill_value=0)
top=cat.mean().nlargest(8).index.tolist();heat=cat.groupby(cat.index.normalize()).mean().reindex(days)[top].T
fig=base('02','Groente is vaak de grootste groep','Gemiddeld aantal productnamen per meetmoment · acht grootste categorieën',7.4)
ax=fig.add_axes([.235,.205,.66,.54]);im=ax.imshow(heat,cmap=cmap,vmin=0,vmax=60,aspect='auto');ax.set_yticks(range(len(top)));ax.set_yticklabels(top,fontsize=10);ax.tick_params(length=0,pad=9);ax.set_xticks(ix);ax.set_xticklabels([d.strftime('%d') for d in days]);ax.set_xlabel('Dag in februari',labelpad=12)
for row in range(len(top)):
 for col in ix:
  v=heat.iloc[row,col];ax.text(col,row,f'{v:.0f}',ha='center',va='center',fontsize=8,color='white' if v>30 else INK)
cax=fig.add_axes([.916,.205,.014,.54]);cb=fig.colorbar(im,cax=cax);cb.outline.set_visible(False);cb.set_label('Gemiddeld aantal',fontsize=9)
foot(fig,'Elke dag is het gemiddelde over de beschikbare meetmomenten; afwezige categorieën tellen als nul.\n460 waarnemingen zonder categorie zijn hier weggelaten. 4 en 25 februari zijn gedeeltelijke dagen.')
save(fig,'categorieen-per-dag')
selected=['AH Rookworst mager','AH Focaccia mozzarella','AH Rode druiven pitloos','AH Hutspot','AH Terra Biologische gerookte tofu','AH Lasagne verspakket','AH Kipfilet','AH Pastel de nata']
selected=[s for s in selected if s in set(x.title)]
pres=x[['t','day','title']].drop_duplicates().groupby(['title','day']).size().unstack(fill_value=0).reindex(index=selected,columns=days,fill_value=0).div(daily['count'],axis=1)*100
labels=[s.removeprefix('AH ').replace('Terra Biologische gerookte tofu','Terra gerookte tofu') for s in selected]
fig=base('03','Dezelfde naam, een ander patroon','Aandeel meetmomenten waarop een productnaam voorkomt · selectie van zeven producten',7.4)
ax=fig.add_axes([.235,.205,.66,.54]);im=ax.imshow(pres,cmap=cmap,vmin=0,vmax=100,aspect='auto');ax.set_yticks(range(len(selected)));ax.set_yticklabels(labels,fontsize=10);ax.set_xticks(ix);ax.set_xticklabels([d.strftime('%d') for d in days]);ax.set_xlabel('Dag in februari',labelpad=12);ax.tick_params(length=0,pad=9)
for row in range(len(selected)):
 for col in ix:
  v=pres.iloc[row,col];ax.text(col,row,'·' if v==0 else str(round(v)),ha='center',va='center',fontsize=8,color='white' if v>60 else INK)
cax=fig.add_axes([.916,.205,.014,.54]);cb=fig.colorbar(im,cax=cax);cb.outline.set_visible(False);cb.set_label('Aanwezig bij metingen (%)',fontsize=9)
foot(fig,'100 = aanwezig bij alle metingen die dag; · = niet waargenomen. Alle productnamen beginnen met AH.\nDezelfde naam kan nieuwe voorraad betreffen. Deze data volgt geen individuele verpakkingen of verkopen.')
save(fig,'terugkerende-producten')
summary={'sourceCommit':'39b65f83db54ff937c0d43aed3a48950eca76e7e','rows':len(x),'snapshots':len(snap),'days':len(days),'productNames':x.title.nunique(),'minPerSnapshot':int(snap.min()),'maxPerSnapshot':int(snap.max()),'medianPerSnapshot':float(snap.median()),'daily':[{ 'date':str(d.date()),**{k:float(v) for k,v in row.items()}} for d,row in daily.iterrows()],'selectedProducts':selected}
(ROOT/'analysis/appie-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in summary.items() if k!='daily'},ensure_ascii=False))
