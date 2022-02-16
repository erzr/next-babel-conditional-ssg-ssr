// SSG related things that should be deleted
// when in SSR mode

const SSG_EXPORTS_TO_DELETE = [
  "getStaticProps",
  "getStaticPaths",
  "unstable_getStaticProps",
  "unstable_getStaticPaths",
];

// SSR related things that should be deleted
// when in SSG mode
const SSR_EXPORTS_TO_DELETE = [
  "getServerSideProps",
  "unstable_getServerProps",
  "unstable_getServerSideProps",
];

const shouldExportBeDeleted = (mode, name) => {
  const isSsr = mode === "ssr";
  const toDelete = isSsr ? SSG_EXPORTS_TO_DELETE : SSR_EXPORTS_TO_DELETE;
  return toDelete.indexOf(name) > -1;
};

// This is adapted from here: https://github.com/vercel/next.js/blob/canary/packages/next/build/babel/plugins/next-ssg-transform.ts#L253
module.exports = (mode) => {
  return {
    visitor: {
      Program(programPath) {
        programPath.traverse({
          ExportNamedDeclaration(exportNamedPath) {
            const specifiers = exportNamedPath.get("specifiers");
            if (specifiers.length) {
              specifiers.forEach((s) => {
                if (
                  shouldExportBeDeleted(
                    mode,
                    s.isIdentifier(s.node.exported)
                      ? s.node.exported.name
                      : s.node.exported.value
                  )
                ) {
                  s.remove();
                }
              });

              if (exportNamedPath.node.specifiers.length < 1) {
                exportNamedPath.remove(); // bye
              }
              return;
            }

            const decl = exportNamedPath.get("declaration");

            if (decl == null || decl.node == null) {
              return;
            }

            switch (decl.node.type) {
              case "FunctionDeclaration": {
                const name = decl.node.id.name;
                if (shouldExportBeDeleted(mode, name)) {
                  exportNamedPath.remove(); // l8ter
                }
                break;
              }
              case "VariableDeclaration": {
                const inner = decl.get("declarations");

                inner.forEach((d) => {
                  if (d.node.id.type !== "Identifier") {
                    return;
                  }
                  const name = d.node.id.name;
                  if (shouldExportBeDeleted(mode, name)) {
                    exportNamedPath.remove(); // nice seeing you
                  }
                });
                break;
              }
              default: {
                break;
              }
            }
          },
        });
      },
    },
  };
};
