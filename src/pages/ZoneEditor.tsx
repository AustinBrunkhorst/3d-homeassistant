import Box from '@material-ui/core/Box';
import React from 'react';
import styled from 'styled-components';

import AssetSidebar from 'components/AssetSidebar';
import ZoneEditorScene from 'scene/ZoneEditorScene';

const PageContainer = styled(Box)`
  height: 100%;
  overflow: hidden;
`;

function ZoneEditorPage() {
  return (
    <PageContainer display="flex" flexDirection="row">
      <AssetSidebar />
      <Box flexGrow={1}>
        <ZoneEditorScene />
      </Box>
    </PageContainer>
  );
}

export default ZoneEditorPage;
