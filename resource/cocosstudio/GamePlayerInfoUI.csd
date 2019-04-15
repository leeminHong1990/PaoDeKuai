<GameFile>
  <PropertyGroup Name="GamePlayerInfoUI" Type="Layer" ID="85446593-da60-46ec-ac32-eb0dacd79e9f" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="516" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="bg_panel" ActionTag="-1084937720" Tag="525" IconVisible="False" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" TouchEnable="True" ClipAble="False" BackColorAlpha="0" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
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
          <AbstractNodeData Name="playerinfo_panel" ActionTag="-2101366390" Tag="517" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="453.0000" RightMargin="453.0000" TopMargin="242.0000" BottomMargin="242.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="20" RightEage="20" TopEage="20" BottomEage="20" Scale9OriginX="20" Scale9OriginY="20" Scale9Width="334" Scale9Height="196" ctype="PanelObjectData">
            <Size X="374.0000" Y="236.0000" />
            <Children>
              <AbstractNodeData Name="portrait_sprite" ActionTag="2097103693" Tag="518" IconVisible="False" LeftMargin="1.1947" RightMargin="272.8053" TopMargin="2.0882" BottomMargin="133.9118" ctype="SpriteObjectData">
                <Size X="100.0000" Y="100.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="51.1947" Y="183.9118" />
                <Scale ScaleX="0.8100" ScaleY="0.8100" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1369" Y="0.7793" />
                <PreSize X="0.2674" Y="0.4237" />
                <FileData Type="Normal" Path="GameHallUI/portrait_sprite.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="name_label" ActionTag="-1755594310" Tag="520" IconVisible="False" LeftMargin="108.1023" RightMargin="65.8977" TopMargin="15.0617" BottomMargin="195.9383" IsCustomSize="True" FontSize="24" LabelText="未知" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="200.0000" Y="25.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="208.1023" Y="208.4383" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5564" Y="0.8832" />
                <PreSize X="0.5348" Y="0.1059" />
                <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="id_label" ActionTag="976907797" Tag="521" IconVisible="False" LeftMargin="108.1023" RightMargin="65.8977" TopMargin="48.0987" BottomMargin="162.9013" IsCustomSize="True" FontSize="24" LabelText="未知" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="200.0000" Y="25.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="208.1023" Y="175.4013" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5564" Y="0.7432" />
                <PreSize X="0.5348" Y="0.1059" />
                <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="magic_scroll" ActionTag="-342400065" Tag="522" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="2.0000" RightMargin="2.0000" TopMargin="129.7612" BottomMargin="6.2388" TouchEnable="True" ClipAble="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" IsBounceEnabled="True" ScrollDirectionType="Horizontal" ctype="ScrollViewObjectData">
                <Size X="370.0000" Y="100.0000" />
                <Children>
                  <AbstractNodeData Name="items" ActionTag="-1904369359" Tag="523" IconVisible="False" PositionPercentYEnabled="True" LeftMargin="276.1200" RightMargin="11.8800" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="25" RightEage="25" TopEage="25" BottomEage="25" Scale9OriginX="25" Scale9OriginY="25" Scale9Width="28" Scale9Height="28" ctype="PanelObjectData">
                    <Size X="92.0000" Y="100.0000" />
                    <Children>
                      <AbstractNodeData Name="magic_img" ActionTag="1098707803" Tag="524" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-31.0000" RightMargin="-31.0000" TopMargin="-27.0000" BottomMargin="-27.0000" LeftEage="50" RightEage="50" TopEage="50" BottomEage="50" Scale9OriginX="50" Scale9OriginY="50" Scale9Width="54" Scale9Height="54" ctype="ImageViewObjectData">
                        <Size X="154.0000" Y="154.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="46.0000" Y="50.0000" />
                        <Scale ScaleX="0.4000" ScaleY="0.4000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="1.6739" Y="1.5400" />
                        <FileData Type="Normal" Path="MagicUI/1.png" Plist="" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleY="0.5000" />
                    <Position X="276.1200" Y="50.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.7266" Y="0.5000" />
                    <PreSize X="0.2421" Y="1.0000" />
                    <FileData Type="Normal" Path="PlayerInfoUI/magic_bg_img.png" Plist="" />
                    <SingleColor A="255" R="150" G="200" B="255" />
                    <FirstColor A="255" R="150" G="200" B="255" />
                    <EndColor A="255" R="255" G="255" B="255" />
                    <ColorVector ScaleY="1.0000" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="187.0000" Y="56.2388" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.2383" />
                <PreSize X="0.9893" Y="0.4237" />
                <SingleColor A="255" R="255" G="150" B="100" />
                <FirstColor A="255" R="255" G="150" B="100" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
                <InnerNodeSize Width="380" Height="100" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="0.2922" Y="0.3278" />
            <FileData Type="Normal" Path="PlayerInfoUI/bg_img.png" Plist="" />
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