<GameFile>
  <PropertyGroup Name="PlayerInfoUI" Type="Layer" ID="b3ebf561-d95c-46b7-bcf5-b288f2f5c4cb" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="447" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="bg_panel" ActionTag="-183545652" Tag="448" IconVisible="False" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" TouchEnable="True" ClipAble="False" BackColorAlpha="178" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
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
          <AbstractNodeData Name="playerinfo_panel" ActionTag="-340166259" Tag="566" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="254.0000" RightMargin="254.0000" TopMargin="148.0000" BottomMargin="148.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="20" RightEage="20" TopEage="20" BottomEage="20" Scale9OriginX="20" Scale9OriginY="20" Scale9Width="732" Scale9Height="384" ctype="PanelObjectData">
            <Size X="772.0000" Y="424.0000" />
            <Children>
              <AbstractNodeData Name="portrait_sprite" ActionTag="-1162463833" Tag="891" IconVisible="False" LeftMargin="18.8849" RightMargin="653.1151" TopMargin="29.6649" BottomMargin="294.3351" ctype="SpriteObjectData">
                <Size X="100.0000" Y="100.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="68.8849" Y="344.3351" />
                <Scale ScaleX="0.8100" ScaleY="0.8100" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0892" Y="0.8121" />
                <PreSize X="0.1295" Y="0.2358" />
                <FileData Type="Normal" Path="GameHallUI/portrait_sprite.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="black_bg_img" ActionTag="-98348275" Tag="1202" IconVisible="False" LeftMargin="112.0917" RightMargin="239.9083" TopMargin="42.1317" BottomMargin="343.8683" LeftEage="138" RightEage="138" TopEage="12" BottomEage="12" Scale9OriginX="138" Scale9OriginY="12" Scale9Width="144" Scale9Height="14" ctype="ImageViewObjectData">
                <Size X="420.0000" Y="38.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="322.0917" Y="362.8683" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4172" Y="0.8558" />
                <PreSize X="0.5440" Y="0.0896" />
                <FileData Type="Normal" Path="PlayerInfoUI/bottom_bg.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="name_label" ActionTag="1323001268" Tag="30" IconVisible="False" LeftMargin="135.2881" RightMargin="436.7119" TopMargin="47.3839" BottomMargin="351.6161" IsCustomSize="True" FontSize="25" LabelText="未知" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="200.0000" Y="25.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="235.2881" Y="364.1161" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="111" G="86" B="57" />
                <PrePosition X="0.3048" Y="0.8588" />
                <PreSize X="0.2591" Y="0.0590" />
                <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="id_label" ActionTag="-767065125" Tag="2288" IconVisible="False" LeftMargin="135.2881" RightMargin="436.7119" TopMargin="88.2359" BottomMargin="310.7641" IsCustomSize="True" FontSize="25" LabelText="未知" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="200.0000" Y="25.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="235.2881" Y="323.2641" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="111" G="86" B="57" />
                <PrePosition X="0.3048" Y="0.7624" />
                <PreSize X="0.2591" Y="0.0590" />
                <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="magic_scroll" ActionTag="20406347" Tag="109" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="18.2192" RightMargin="17.7808" TopMargin="148.2984" BottomMargin="23.7016" TouchEnable="True" ClipAble="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" IsBounceEnabled="True" ScrollDirectionType="Horizontal" ctype="ScrollViewObjectData">
                <Size X="736.0000" Y="252.0000" />
                <Children>
                  <AbstractNodeData Name="items" ActionTag="-354939456" Tag="110" IconVisible="False" PositionPercentYEnabled="True" PercentHeightEnable="True" PercentHeightEnabled="True" LeftMargin="558.3005" RightMargin="31.6995" TopMargin="12.6000" BottomMargin="37.8000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
                    <Size X="160.0000" Y="201.6000" />
                    <Children>
                      <AbstractNodeData Name="magic_img" ActionTag="-1200156372" Tag="111" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="3.0000" RightMargin="3.0000" TopMargin="39.7667" BottomMargin="7.8333" LeftEage="50" RightEage="50" TopEage="50" BottomEage="50" Scale9OriginX="-4" Scale9OriginY="-4" Scale9Width="54" Scale9Height="54" ctype="ImageViewObjectData">
                        <Size X="154.0000" Y="154.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="80.0000" Y="84.8333" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.4208" />
                        <PreSize X="0.9625" Y="0.7639" />
                        <FileData Type="Default" Path="Default/ImageFile.png" Plist="" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleY="0.5000" />
                    <Position X="558.3005" Y="138.6000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.7444" Y="0.5500" />
                    <PreSize X="0.2133" Y="0.8000" />
                    <SingleColor A="255" R="150" G="200" B="255" />
                    <FirstColor A="255" R="150" G="200" B="255" />
                    <EndColor A="255" R="255" G="255" B="255" />
                    <ColorVector ScaleY="1.0000" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="18.2192" Y="23.7016" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0236" Y="0.0559" />
                <PreSize X="0.9534" Y="0.5943" />
                <SingleColor A="255" R="255" G="150" B="100" />
                <FirstColor A="255" R="255" G="150" B="100" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
                <InnerNodeSize Width="750" Height="252" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="0.6031" Y="0.5889" />
            <FileData Type="Normal" Path="PlayerInfoUI/playerinfo_bg.png" Plist="" />
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