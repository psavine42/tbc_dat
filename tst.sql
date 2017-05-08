
--'testing'

SELECT DISTINCT 
       TOP (100) PERCENT
        {fn CONCAT(CONVERT(varchar(10), jc.jobnum), {fn CONCAT(' - ',dbo.actrec.jobnme)})} AS Job,
        p.phsnme AS phasename, 
        {fn CONCAT(CONVERT(varchar(10), dbo.cstcde.recnum), {fn CONCAT(' - ',dbo.cstcde.cdenme)})} AS cost_code, 
        jc.trnnum AS trans, 
        FORMAT(dbo.jobcst.trndte, 'MM-dd-yyyy') AS date, 
        dbo.jobcst.dscrpt AS type, 
        CASE WHEN (jc.vndnum > 0) THEN dbo.actpay.vndnme 
             WHEN (jc.eqpnum > 0) THEN dbo.eqpmnt.shtnme 
             WHEN (jc.empnum > 0) THEN concat(dbo.employ.fstnme, ' ', dbo.employ.lstnme) ELSE '-' 
            END AS veee, 
        jc.csthrs,
        jc.cstamt AS Cost,

       (SELECT   SUM(hrsorg) AS hrsorg
         FROM    dbo.bdglin
         WHERE   (recnum = jc.jobnum) AND (phsnum = jc.phsnum)) 
         AS hrsorg,

        (SELECT  SUM(hrsbdg) AS hrsbdg
         FROM    dbo.bdglin AS bdglin_2
         WHERE   (recnum = jc.jobnum) AND (phsnum = jc.phsnum)) 
         AS hrsbdg,

        (SELECT  SUM(appamt) AS cottl
         FROM    dbo.prmchg AS prmchg_1
         WHERE   (status = 1) AND (jobnum = jc.jobnum) AND (phsnum = jc.phsnum)) 
         AS ttlorgx,

        (SELECT  SUM(ttlbdg) AS ttlbdg
         FROM    dbo.bdglin AS bdglin_1
         WHERE   (recnum = jc.jobnum) AND (phsnum = jc.phsnum)) 
         AS ttlbdg, 
         dbo.cstcde.recnum, 
         dbo.actrec.recnum AS Expr1, 
         p.phsnum

FROM dbo.actpay RIGHT OUTER JOIN
      (SELECT  phsnme, recnum, phsnum
       FROM    dbo.jobphs) 
       AS p 
       INNER JOIN dbo.jobcst As jc
       INNER JOIN dbo.cstcde 
       ON jc.cstcde = dbo.cstcde.recnum 
       INNER JOIN dbo.actrec 
       ON jc.jobnum = dbo.actrec.recnum ON p.recnum = dbo.actrec.recnum 
       LEFT OUTER JOIN dbo.employ 
       ON jc.empnum = dbo.employ.recnum
       ON jc.vndnum = dbo.actpay.recnum
       LEFT OUTER JOIN dbo.eqpmnt 
       ON jc.eqpnum = dbo.eqpmnt.recnum

WHERE  (jc.status = 1) AND (jc.jobnum = 16)



---------------------------------------------------------------------------------

SELECT  TOP (100) PERCENT 
    phs.recnum AS rec, 
    dbo.bdglin.cstcde, 
    dbo.bdglin.linnum, 
    dbo.bdglin.phsnum, 
    dbo.bdglin.recnum, 
    dbo.bdglin.hrsbdg, 
    dbo.bdglin.matbdg, 
    dbo.bdglin.ttlbdg, 
    phs.phsnme
FROM dbo.jobphs 
As phs 
RIGHT OUTER JOIN dbo.bdglin 
ON phs.phsnum = dbo.bdglin.phsnum AND phs.recnum = dbo.bdglin.recnum
ORDER BY rec



SELECT  TOP (100) PERCENT 
        phs.recnum AS rec, 
        phs.phsnme,
        lin.cstcde, 
        --lin.linnum, 
        lin.phsnum, 
        lin.recnum, 
        lin.hrsbdg, 
        lin.matbdg, 
        lin.ttlbdg
    FROM dbo.jobphs As phs 
    JOIN dbo.bdglin As lin
    ON phs.phsnum = lin.phsnum  And phs.recnum = lin.recnum

    UNION
    SELECT  TOP (100) PERCENT
        phs.recnum AS rec, 
        phs.phsnme,
        lin.cstcde,
        --lin.linnum, 
        lin.phsnum, 
        lin.recnum, 
        lin.hrsbdg, 
        lin.matbdg, 
        lin.ttlbdg
    FROM dbo.jobphs As phs 
    JOIN dbo.bdglin As lin 
    ON  phs.recnum = lin.recnum
    ORDER BY rec,  phs.phsnme



SELECT TOP (100) PERCENT phs.recnum, phs.phsnum, phs.phsnme, ln.cstcde
FROM      dbo.jobphs 
AS phs 
INNER JOIN  dbo.bdglin 
AS ln 
ON phs.phsnum = ln.phsnum AND phs.recnum = ln.recnum
ORDER BY phs.recnum, phs.phsnum, phs.phsnme




---WORKING CURRENT - MISSING 

SELECT DISTINCT 
       TOP (100) PERCENT { fn CONCAT(CONVERT(varchar(10), dbo.jobcst.jobnum), { fn CONCAT(' - ', dbo.actrec.jobnme) }) } AS Job, 
       dbo.jobphs.phsnme AS phasename, 
       { fn CONCAT(CONVERT(varchar(10), 
        dbo.cstcde.recnum), { fn CONCAT(' - ', dbo.cstcde.cdenme) }) } AS cost_code, 
        dbo.jobcst.trnnum AS trans, 
        FORMAT(dbo.jobcst.trndte, 'MM-dd-yyyy') AS date, dbo.jobcst.dscrpt AS type, 
          CASE WHEN (jc.vndnum > 0) THEN dbo.actpay.vndnme 
             WHEN (jc.eqpnum > 0) THEN dbo.eqpmnt.shtnme 
             WHEN (jc.empnum > 0) THEN concat(dbo.employ.fstnme, ' ', dbo.employ.lstnme) ELSE '-' 
            END AS veee, dbo.jobcst.csthrs, dbo.jobcst.cstamt AS Cost,
                             (SELECT        SUM(hrsorg) AS hrsorg
                               FROM            dbo.bdglin
                               WHERE        (recnum = dbo.jobcst.jobnum) AND (phsnum = dbo.jobcst.phsnum)) AS hrsorg,
                             (SELECT        SUM(hrsbdg) AS hrsbdg
                               FROM            dbo.bdglin AS bdglin_2
                               WHERE        (recnum = dbo.jobcst.jobnum) AND (phsnum = dbo.jobcst.phsnum)) AS hrsbdg,
                             (SELECT        SUM(appamt) AS cottl
                               FROM            dbo.prmchg AS prmchg_1
                               WHERE        (status = 1) AND (jobnum = dbo.jobcst.jobnum) AND (phsnum = dbo.jobcst.phsnum)) AS ttlorgx,
                             (SELECT        SUM(ttlbdg) AS ttlbdg
                               FROM            dbo.bdglin AS bdglin_1
                               WHERE        (recnum = dbo.jobcst.jobnum) AND (phsnum = dbo.jobcst.phsnum)) AS ttlbdg, dbo.cstcde.recnum
FROM  dbo.jobcst 
INNER JOIN dbo.jobphs ON dbo.jobcst.phsnum = dbo.jobphs.phsnum AND dbo.jobcst.jobnum = dbo.jobphs.recnum 
INNER JOIN dbo.cstcde ON dbo.jobcst.cstcde = dbo.cstcde.recnum 
LEFT OUTER JOIN dbo.employ ON dbo.jobcst.empnum = dbo.employ.recnum 
LEFT OUTER JOIN dbo.actrec ON dbo.jobcst.jobnum = dbo.actrec.recnum 
LEFT OUTER JOIN dbo.actpay ON dbo.jobcst.vndnum = dbo.actpay.recnum 
LEFT OUTER JOIN dbo.eqpmnt ON dbo.jobcst.eqpnum = dbo.eqpmnt.recnum
WHERE        (dbo.jobcst.status = 1)
ORDER BY Job, phasename



---WORKING CURRENT - TESTTING 

SELECT DISTINCT 
       TOP (100) PERCENT
        { fn CONCAT(CONVERT(varchar(10), jc.jobnum), { fn CONCAT(' - ', dbo.actrec.jobnme) }) } AS Job, 
     jc.jobnum as j, 
     dbo.jobphs.phsnme AS phasename, 
    { fn CONCAT(CONVERT(varchar(10),   dbo.cstcde.recnum), { fn CONCAT(' - ', dbo.cstcde.cdenme) }) } AS cost_code, 
    jc.trnnum AS trans,
     FORMAT(jc.trndte, 'MM-dd-yyyy') AS date, 
    jc.dscrpt AS type, 
     CASE WHEN (jc.vndnum > 0) THEN dbo.actpay.vndnme 
          WHEN (jc.eqpnum > 0) THEN dbo.eqpmnt.shtnme 
          WHEN (jc.empnum > 0) THEN concat(dbo.employ.fstnme, ' ', dbo.employ.lstnme) ELSE '-' 
            END AS veee,
     jc.csthrs,
    jc.cstamt AS Cost,
                             (SELECT        SUM(hrsorg) AS hrsorg
                               FROM            dbo.bdglin
                               WHERE        (recnum = jc.jobnum) AND (phsnum = jc.phsnum)) AS hrsorg,
                             (SELECT        SUM(hrsbdg) AS hrsbdg
                               FROM            dbo.bdglin 
                               WHERE        (recnum = jc.jobnum) AND (phsnum = jc.phsnum)) AS hrsbdg,
                             (SELECT        SUM(appamt) AS cottl
                               FROM            dbo.prmchg AS prjomchg_1
                               WHERE        (status = 1) AND (jobnum = jc.jobnum) AND (phsnum = jc.phsnum)) AS ttlorgx,
                             (SELECT        SUM(ttlbdg) AS ttlbdg
                               FROM            dbo.bdglin
                               WHERE        (recnum = jc.jobnum) AND (phsnum = jc.phsnum)) AS ttlbdg, 
                               dbo.cstcde.recnum
FROM  dbo.jobcst AS jc
INNER JOIN dbo.jobphs ON jc.phsnum = dbo.jobphs.phsnum AND jc.jobnum = dbo.jobphs.recnum 
INNER JOIN dbo.cstcde ON jc.cstcde = dbo.cstcde.recnum 
LEFT OUTER JOIN dbo.employ ON jc.empnum = dbo.employ.recnum 
LEFT OUTER JOIN dbo.actrec ON jc.jobnum = dbo.actrec.recnum 
LEFT OUTER JOIN dbo.actpay ON jc.vndnum = dbo.actpay.recnum 
LEFT OUTER JOIN dbo.eqpmnt ON jc.eqpnum = dbo.eqpmnt.recnum
WHERE        (jc.status = 1) 
ORDER BY jc, phasename


SELECT  TOP (100) PERCENT 
jc.trnnum AS trans, 
jc.trndte, jc.dscrpt AS type, 
jc.csthrs, jc.cstamt AS Cost, 
bdglin.hrsbdg, 
bdglin.phsnum, 
bdglin.cstcde, 
dbo.jobphs.phsnme
FROM    dbo.bdglin AS bdglin 
FULL OUTER JOIN dbo.jobphs 
ON 
    (bdglin.recnum = dbo.jobphs.recnum AND bdglin.phsnum = dbo.jobphs.phsnum)
   
FULL OUTER JOIN dbo.actrec 
INNER JOIN dbo.jobcst 
AS jc 
ON dbo.actrec.recnum = jc.jobnum ON bdglin.recnum = jc.jobnum AND bdglin.phsnum = jc.phsnum

WHERE        (jc.status = 1) AND (jc.jobnum = 16)
ORDER BY bdglin.phsnum








SELECT        TOP (100) PERCENT phs.recnum, phs.phsnum, phs.phsnme, ln.hrsbdg, ln.ttlbdg, ln.linnum, dbo.cstcde.cdenme, ln.ttlorg, dbo.cstcde.recnum AS Expr1
FROM            dbo.cstcde RIGHT OUTER JOIN
                         dbo.bdglin AS ln ON dbo.cstcde.recnum = ln.cstcde FULL OUTER JOIN
                         dbo.jobphs AS phs ON ln.phsnum = phs.phsnum AND ln.recnum = phs.recnum
ORDER BY phs.recnum, phs.phsnum, phs.phsnme



SELECT TOP (100) PERCENT jc.trnnum AS trans, jc.trndte, jc.dscrpt AS type, jc.csthrs, jc.cstamt AS Cost, phs.phsnme
FROM    dbo.jobcst AS jc 
FULL OUTER JOIN dbo.jobphs As phs
ON ( jc.phsnum = phsphsnum AND jc.jobnum = phs.recnum)
OR ( jc.jobnum = phs.recnum)

WHERE        (jc.status = 1) AND (jc.jobnum = 16)
ORDER BY dbo.jobphs.phsnme



----------------------------------------------
----------------------------------------------
Select Distinct *
FROM
   (SELECT  TOP (100) PERCENT 
     phs.recnum as jobnum, 
     phs.phsnum as phsnum, 
     dbo.cstcde.recnum AS cstcde, 
     phs.phsnme, ln.hrsbdg, ln.ttlbdg, ln.linnum, dbo.cstcde.cdenme, ln.ttlorg 
     FROM     dbo.cstcde 
     RIGHT OUTER JOIN dbo.bdglin 
     AS ln 
     ON dbo.cstcde.recnum = ln.cstcde 
     FULL OUTER JOIN dbo.jobphs 
     AS phs
     ON ln.phsnum = phs.phsnum AND ln.recnum = phs.recnum)  
     As ds
Full outer join
  (SELECT  jobnum, phsnum,  cstcde, trnnum, dscrpt, trndte, cstamt, csthrs, status
    FROM            dbo.jobcst
    WHERE        (status = 1)) 
    as js On js.jobnum = ds.jobnum and js.phsnum =  ds.phsnum and js.cstcde = ds.cstcde
ORDER BY ds.jobnum






----------------------------------------------
Select Distinct *
FROM
   (SELECT DISTINCT TOP (100) PERCENT 
   phs.recnum, 
   phs.phsnum, 
   phs.phsnme, 
   ln.hrsbdg, 
   ln.ttlbdg, 
   ln.linnum, 
   ln.ttlorg
FROM            dbo.bdglin AS ln FULL OUTER JOIN
                         dbo.jobphs AS phs ON ln.phsnum = phs.phsnum AND ln.recnum = phs.recnum)  
     As ds
Full outer join
  (SELECT  jobnum, phsnum,  cstcde, trnnum, dscrpt, trndte, cstamt, csthrs, status
    FROM            dbo.jobcst
    WHERE        (status = 1)) 
    as js On js.jobnum = ds.jobnum and js.phsnum =  ds.phsnum 
ORDER BY ds.jobnum