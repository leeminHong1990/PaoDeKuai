<GameFile>
  <PropertyGroup Name="FeedBackUI" Type="Layer" ID="33ec37e0-16a2-4578-b5ea-ed1e77ab1aa2" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="41" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="bg_panel" ActionTag="-1905040792" Tag="64" IconVisible="False" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" TouchEnable="True" ClipAble="False" BackColorAlpha="178" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="1.0000" Y="1.0000" />
            <SingleColor A="255" R="0" G="0" B="0" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="feedback_panel" ActionTag="-1318907444" Tag="54" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="257.0000" RightMargin="257.0000" TopMargin="111.0000" BottomMargin="111.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="80" RightEage="80" TopEage="80" BottomEage="80" Scale9OriginX="80" Scale9OriginY="80" Scale9Width="606" Scale9Height="338" ctype="PanelObjectData">
            <Size X="766.0000" Y="498.0000" />
            <Children>
              <AbstractNodeData Name="title_img" ActionTag="137714139" Tag="776" IconVisible="False" LeftMargin="288.1800" RightMargin="281.8200" TopMargin="27.9883" BottomMargin="430.0117" LeftEage="64" RightEage="64" TopEage="13" BottomEage="13" Scale9OriginX="64" Scale9OriginY="13" Scale9Width="68" Scale9Height="14" ctype="ImageViewObjectData">
                <Size X="196.0000" Y="40.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="386.1800" Y="450.0117" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5042" Y="0.9036" />
                <PreSize X="0.2559" Y="0.0803" />
                <FileData Type="Normal" Path="FeedBackUI/title.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="bg_img" ActionTag="-529392279" Tag="68" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="96.7880" RightMargin="69.2120" TopMargin="84.0200" BottomMargin="93.9800" Scale9Enable="True" LeftEage="90" RightEage="90" TopEage="60" BottomEage="60" Scale9OriginX="90" Scale9OriginY="60" Scale9Width="14" Scale9Height="20" ctype="ImageViewObjectData">
                <Size X="600.0000" Y="320.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="396.7880" Y="253.9800" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5180" Y="0.5100" />
                <PreSize X="0.7833" Y="0.6426" />
                <FileData Type="Normal" Path="BackGround/public_flat_bg.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="feedback_input" ActionTag="-1583894580" Tag="65" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="121.7880" RightMargin="94.2120" TopMargin="104.0200" BottomMargin="113.9800" TouchEnable="True" FontSize="26" IsCustomSize="True" LabelText="" PlaceHolderText="您的反馈意见" MaxLengthText="10" ctype="TextFieldObjectData">
                <Size X="550.0000" Y="280.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="396.7880" Y="253.9800" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="49" G="48" B="48" />
                <PrePosition X="0.5180" Y="0.5100" />
                <PreSize X="0.7180" Y="0.5622" />
              </AbstractNodeData>
              <AbstractNodeData Name="confirm_btn" ActionTag="770644376" Tag="67" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="286.0000" RightMargin="286.0000" TopMargin="383.1884" BottomMargin="28.8116" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="164" Scale9Height="64" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="194.0000" Y="86.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="383.0000" Y="71.8116" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.1442" />
                <PreSize X="0.2533" Y="0.1727" />
                <TextColor A="255" R="65" G="65" B="70" />
                <NormalFileData Type="Normal" Path="Default/ok_btn.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="return_btn" ActionTag="1473358653" Tag="69" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="661.8816" RightMargin="22.1184" TopMargin="16.4354" BottomMargin="407.5646" TouchEnable="True" FontSize="14" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="52" Scale9Height="52" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="82.0000" Y="74.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="702.8816" Y="444.5646" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9176" Y="0.8927" />
                <PreSize X="0.1070" Y="0.1486" />
                <TextColor A="255" R="65" G="65" B="70" />
                <NormalFileData Type="Normal" Path="Default/return_btn.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="0.5984" Y="0.6917" />
            <FileData Type="Normal" Path="BackGround/small_win.png" Plist="" />
            <SingleColor A="255" R="150" G="200" B="255" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>